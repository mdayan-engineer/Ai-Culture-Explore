import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { initFirebase, getFirebaseDb } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';
import { Heart, MessageSquare, Share2, Loader2, Send } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      await initFirebase();
      const db = getFirebaseDb();
      const q = query(collection(db, 'communityPosts'), orderBy('createdAt', 'desc'), limit(50));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (e: any) => {
    e.preventDefault();
    if (!user) return alert("Please log in to post.");
    setPosting(true);
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    
    try {
      await initFirebase();
      const db = getFirebaseDb();
      await addDoc(collection(db, 'communityPosts'), {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Explorer',
        authorPhoto: user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid,
        content,
        likesCount: 0,
        createdAt: serverTimestamp()
      });

      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      alert("Failed to post.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Community</h1>
        <p className="mt-2 text-gray-500">Share your journeys and discover inspiration from other explorers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea 
            name="content" 
            required 
            placeholder="Share your latest travel story, tip, or question..." 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[100px]" 
          />
          <div className="flex justify-end">
            <button 
              disabled={posting} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <img src={post.authorPhoto} alt={post.authorName} className="w-10 h-10 rounded-full bg-gray-100" />
                <div>
                  <h3 className="font-bold text-gray-900">{post.authorName}</h3>
                  <span className="text-xs text-gray-500">
                     {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleString() : 'Just now'}
                  </span>
                </div>
              </div>
              <p className="text-gray-800 mb-6 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-6 text-gray-500 border-t border-gray-50 pt-4">
                <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likesCount || 0}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">Reply</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
