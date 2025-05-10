"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { X } from "lucide-react"
import { TwitterTweetEmbed } from 'react-twitter-embed'

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

interface Tweet {
  id: number
  tweet_id: string
  content: string
  client_id: number | null
  posted_at: string
  status: string
}

interface TweetReply {
  id: number
  tweet_id: number
  reply_id: string
  author_id: string
  content: string
  created_at: string
  processed: boolean
  creator_id: number | null
  author_name: string
  author_username: string
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("jwt")!
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function TwitterTab() {
  const [newTweet, setNewTweet] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null)
  const [dmMessage, setDmMessage] = useState("")
  const [isSendingDm, setIsSendingDm] = useState(false)
  const [dmModalOpen, setDmModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null)

  // Fetch tweets
  const { data: tweets = [], error: tweetsError, mutate: mutateTweets } = useSWR<Tweet[]>(
    `${API_BASE}/admin/tweets`,
    fetcher
  )

  // Fetch replies for selected tweet
  const { data: replies = [], error: repliesError } = useSWR<TweetReply[]>(
    selectedTweet ? `${API_BASE}/admin/tweets/${selectedTweet.id}/replies` : null,
    fetcher
  )

  const handlePostTweet = async () => {
    if (!newTweet.trim()) return
    setIsPosting(true)

    try {
      await fetch(`${API_BASE}/admin/tweets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ content: newTweet }),
      })
      setNewTweet("")
      mutateTweets()
    } catch (error) {
      console.error("Failed to post tweet:", error)
    } finally {
      setIsPosting(false)
    }
  }

  const openDM = (user: {id: string, name: string}) => {
    setSelectedUser(user)
    setDmMessage("")
    setDmModalOpen(true)
  }

  const handleSendDM = async () => {
    if (!selectedUser || !dmMessage.trim()) return
    setIsSendingDm(true)

    try {
      await fetch(`${API_BASE}/admin/twitter/dm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          message: dmMessage
        }),
      })
      setDmMessage("")
      setDmModalOpen(false)
    } catch (error) {
      console.error("Failed to send DM:", error)
    } finally {
      setIsSendingDm(false)
    }
  }

  const handleProcessReply = async (reply: TweetReply) => {
    if (!selectedTweet) return

    try {
      await fetch(`${API_BASE}/admin/tweets/${selectedTweet.id}/replies/${reply.reply_id}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      // Refresh replies after processing
      mutateTweets()
    } catch (error) {
      console.error("Failed to process reply:", error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Post a Tweet</h2>
        <div className="flex gap-4">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What's happening?"
            className="flex-1 p-3 border rounded-lg bg-black/20 border-white/10 text-white"
            rows={3}
          />
          <button
            onClick={handlePostTweet}
            disabled={isPosting || !newTweet.trim()}
            className="px-4 py-2 bg-[#ff4d8d] text-white rounded-lg disabled:opacity-50"
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Tweet History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Tweet History</h2>
          {tweetsError ? (
            <div className="text-red-500">Error loading tweets</div>
          ) : (
            <div className="space-y-4">
              {tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className={`p-4 border rounded-lg ${
                    selectedTweet?.id === tweet.id ? "border-[#ff4d8d]" : "border-white/10"
                  }`}
                >
                  <TwitterTweetEmbed tweetId={tweet.tweet_id} />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedTweet(tweet)}
                      className="px-3 py-1 bg-[#ff4d8d] text-white rounded-lg text-sm hover:bg-[#ff1a6c]"
                    >
                      View Replies
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Tweet and Replies */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedTweet ? "Reply Management" : "Select a Tweet"}
          </h2>
          {selectedTweet && (
            <div className="space-y-4">
              <TwitterTweetEmbed tweetId={selectedTweet.tweet_id} />
              
              {/* Replies List */}
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-medium">Replies ({replies.length})</h3>
                {repliesError ? (
                  <div className="text-red-500">Error loading replies</div>
                ) : (
                  <div className="space-y-3">
                    {replies.map((reply) => (
                      <div key={reply.id} className="bg-black/20 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-white">{reply.author_name}</h3>
                            <p className="text-sm text-white/70">@{reply.author_username}</p>
                          </div>
                          <div className="text-xs text-white/50">
                            {new Date(reply.created_at).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-white/90 mb-4">{reply.content}</p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleProcessReply(reply)}
                            disabled={reply.processed}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              reply.processed
                                ? "bg-gray-600 text-white/50 cursor-not-allowed"
                                : "bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white"
                            }`}
                          >
                            {reply.processed ? "Added as Creator" : "Add as Creator"}
                          </button>
                          <button
                            onClick={() => openDM({id: reply.author_id, name: reply.author_name})}
                            className="px-3 py-1 bg-[#ff4d8d] text-white rounded-lg text-sm hover:bg-[#ff1a6c]"
                          >
                            Send DM
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DM Modal */}
      {dmModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-black/30 backdrop-blur p-6 rounded-xl border border-white/10 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              Send DM to {selectedUser.name}
            </h2>
            <textarea
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border rounded-lg bg-black/20 border-white/10 text-white mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDmModalOpen(false)}
                className="px-4 py-2 border border-white/30 rounded text-white/70 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendDM}
                disabled={isSendingDm || !dmMessage.trim()}
                className={`px-4 py-2 rounded transition ${
                  !dmMessage.trim()
                    ? "bg-gray-600 text-white/50 cursor-not-allowed"
                    : "bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white"
                }`}
              >
                {isSendingDm ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 