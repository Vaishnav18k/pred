"use client";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignIn } from "@stackframe/stack";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  // If user is logged in, redirect to chat
  useEffect(() => {
    if (user) {
      router.push('/chat');
    }
  }, [user, router]);

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-500 h-12 w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to AI Chat</h1>
              <p className="text-gray-600">Sign in to start chatting with powerful AI models</p>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Continue with
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <SignIn />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-6 text-center">
            <p className="text-sm text-gray-600">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Powered by <span className="font-medium text-blue-600">AI Chat Platform</span>
          </p>
        </div>
      </div>
    </div>
  );
}