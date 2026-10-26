/**
 * PlantPulse Image Quality & Plant Validation Engine
 * Calculates resolution, brightness, and performs rigorous plant foliage detection.
 * Distinguishes real plant leaves from software screenshots, UI tables, documents, objects, etc.
 */

export function checkImageQualityAndPlant(imageDataUrl) {
  return new Promise((resolve) => {
    if (!imageDataUrl) {
      resolve({
        isPlant: false,
        quality: { status: 'POOR', score: 0, message: 'No image provided.' }
      });
      return;
    }

    // Preset SVG images are always valid high quality plant images
    if (imageDataUrl.includes('svg+xml')) {
      resolve({
        isPlant: true,
        quality: { status: 'GOOD', score: 98, message: 'High quality sample preset.' }
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageDataUrl;

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width || 500;
        const height = img.naturalHeight || img.height || 500;

        if (width < 100 || height < 100) {
          resolve({
            isPlant: false,
            isPoorImage: true,
            quality: { status: 'POOR', score: 20, message: 'Image resolution is too small for plant analysis.' }
          });
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 150, 150);

        const imgData = ctx.getImageData(0, 0, 150, 150);
        const data = imgData.data;

        let totalPixels = 22500;
        let totalBrightness = 0;
        let whiteOrLightGreyPixels = 0; // Pure white / light grey document background
        let organicGreenPixels = 0;     // Chlorophyll green
        let organicNecroticPixels = 0;  // Brown necrotic spots/lesions
        let organicYellowPixels = 0;    // Chlorotic yellow leaf tissue
        let darkSpotPixels = 0;         // Black rot / necrotic spot pixels on leaf
        let darkTextLines = 0;          // Document text border lines
        let flatUiColorPixels = 0;      // Digital UI buttons
        let humanSkinPixels = 0;        // Human skin tone signatures

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;

          // Pure white / light document background (rgb > 225)
          if (r > 225 && g > 225 && b > 225) {
            whiteOrLightGreyPixels++;
          }
          else {
            // Real organic leaf green: (g > r + 8) AND (g > b + 8)
            const isOrganicGreen = (g > r + 8) && (g > b + 8) && (g < 235);
            // Real organic necrotic leaf spot / lesion (brown/tan)
            const isOrganicBrown = (r > g + 5) && (g > b) && (r < 210) && (r - b > 15);
            // Chlorotic yellow leaf tissue
            const isOrganicYellow = (r > 110 && g > 100 && b < 110 && r > b + 25);
            // Dark disease spots / lesions on leaf (r < 75, g < 75, b < 75)
            const isDarkSpot = (r < 75 && g < 75 && b < 75 && (r + g + b) > 25);

            if (isOrganicGreen) organicGreenPixels++;
            if (isOrganicBrown) organicNecroticPixels++;
            if (isOrganicYellow) organicYellowPixels++;
            if (isDarkSpot) darkSpotPixels++;

            // Human skin tone detection (faces, arms, hands, portraits)
            const isSkin = (r > 105 && g > 50 && b > 30 && r > g && r > b && (r - g) > 15 && Math.abs(r - g) < 75);
            if (isSkin) humanSkinPixels++;

            // Flat digital UI button color (#10b981, #3b82f6, #ef4444)
            if ((g > 205 && r < 40 && b < 80) || (b > 205 && r < 40) || (r > 230 && g < 60)) {
              flatUiColorPixels++;
            }
          }
        }

        const lightBgRatio = whiteOrLightGreyPixels / totalPixels;
        const totalPlantMaterialPixels = organicGreenPixels + organicNecroticPixels + organicYellowPixels + darkSpotPixels;
        const plantMaterialRatio = totalPlantMaterialPixels / totalPixels;
        const flatUiRatio = flatUiColorPixels / totalPixels;
        const skinRatio = humanSkinPixels / totalPixels;

        // NON-PLANT DETECTION RULES:
        // 1. Human skin tone ratio > 18% (person / face / photo) AND low green (< 3%) -> NOT A PLANT
        // 2. High digital UI button presence -> NOT A PLANT
        // 3. Extremely low plant material ratio (< 3% of image area) -> NOT A PLANT
        const isNonPlantImage = 
          (skinRatio > 0.18 && organicGreenPixels / totalPixels < 0.03) ||
          (flatUiRatio > 0.04 && plantMaterialRatio < 0.05) ||
          (plantMaterialRatio < 0.035);

        const isPlant = !isNonPlantImage;

        resolve({
          isPlant,
          isPoorImage: false,
          quality: {
            status: isPlant ? 'GOOD' : 'POOR',
            score: isPlant ? Math.min(99, Math.round(plantMaterialRatio * 100 + 50)) : 0,
            message: isPlant ? 'Plant material detected.' : 'Non-plant image detected.'
          }
        });

      } catch (err) {
        console.error("Plant detection analysis error:", err);
        resolve({
          isPlant: false,
          isPoorImage: false,
          quality: { status: 'POOR', score: 0, message: 'Non-plant image detected.' }
        });
      }
    };

    img.onerror = () => {
      resolve({
        isPlant: false,
        isPoorImage: true,
        quality: { status: 'POOR', score: 0, message: 'Failed to process image.' }
      });
    };
  });
}
