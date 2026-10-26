import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, CheckCircle, Send, Sparkles, User, MapPin } from 'lucide-react';
import { COMMUNITY_POSTS } from '../data/plantDatabase';

export default function CommunityView() {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCrop, setNewCrop] = useState('Rice');
  const [isAsking, setIsAsking] = useState(false);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post = {
      id: `p_${Date.now()}`,
      author: 'You (Farmer)',
      avatar: '👨‍🌾',
      location: 'My Farm Location',
      crop: newCrop,
      time: 'Just now',
      title: newTitle.trim(),
      content: newContent.trim(),
      likes: 1,
      commentsCount: 0,
      solved: false,
      agronomistAnswer: null
    };

    setPosts(prev => [post, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsAsking(false);
  };

  const handleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c1f14] to-[#122c1b] border border-[#1b3824] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit mb-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Agronomist Forum & Farmer Q&A
          </span>
          <h2 className="text-xl font-black text-white">Plant Pulse Agronomy Community</h2>
          <p className="text-xs text-gray-300">Ask certified plant pathologists & connect with 50,000+ farmers</p>
        </div>

        <button
          onClick={() => setIsAsking(!isAsking)}
          className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isAsking ? 'Close Form' : 'Ask Agronomist'}</span>
        </button>
      </div>

      {/* Ask Question Form */}
      {isAsking && (
        <form onSubmit={handleCreatePost} className="bg-[#0e1c12] border border-[#1e3e27] rounded-3xl p-6 space-y-4 shadow-2xl animate-fadeIn">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            Ask a Question or Share Disease Symptoms
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Select Crop</label>
              <select
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
                className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Rice">Rice Paddy</option>
                <option value="Maize">Maize / Corn</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Coffee / Tea">Tea / Coffee</option>
                <option value="Cotton">Cotton</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Question Title</label>
              <input
                type="text"
                placeholder="e.g. Yellow spots on tomato leaves after heavy rain"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Detailed Description & Symptoms</label>
            <textarea
              rows={3}
              placeholder="Describe symptoms, weather conditions, fertilizers used..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl p-4 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAsking(false)}
              className="px-4 py-2 rounded-xl bg-[#1a3323] text-gray-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-950"
            >
              Post to Community
            </button>
          </div>
        </form>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#0e1a12] border border-[#1b3824] rounded-2xl p-5 space-y-4 shadow-lg">
            {/* Post Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#14261b] border border-[#1f3f29] text-xl flex items-center justify-center">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {post.author}
                    <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {post.location}
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400">{post.time} • Crop: <span className="text-emerald-400 font-semibold">{post.crop}</span></p>
                </div>
              </div>

              {post.solved && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  Agronomist Solved
                </span>
              )}
            </div>

            {/* Post Body */}
            <div>
              <h3 className="text-sm font-bold text-white mb-1">{post.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{post.content}</p>
            </div>

            {/* Agronomist Answer Box */}
            {post.agronomistAnswer && (
              <div className="bg-[#112417] border border-[#1d422a] rounded-xl p-4 space-y-1">
                <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Agronomist Verified Solution:
                </p>
                <p className="text-xs text-gray-200 leading-normal">{post.agronomistAnswer}</p>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-[#1b3824] pt-3 text-xs text-gray-400">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span>{post.likes} Helpful</span>
              </button>

              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>{post.commentsCount} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
