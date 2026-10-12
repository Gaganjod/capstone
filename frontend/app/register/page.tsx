'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, ArrowRight, Lock, Mail, User, BookOpen } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [dyslexiaSeverity, setDyslexiaSeverity] = useState('MODERATE');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, dyslexiaSeverity }),
      });

      if (role === 'TEACHER') {
        router.push('/teacher');
      } else {
        router.push('/student/assessment');
      }
    } catch (err) {
      router.push('/student/assessment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-500">
              Start your personalized adaptive learning journey
            </p>
          </div>

          <div className="linguapath-card p-8 bg-white space-y-6">
            
            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2 rounded-lg transition-all ${
                  role === 'STUDENT'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                I am a Student
              </button>
              <button
                type="button"
                onClick={() => setRole('TEACHER')}
                className={`py-2 rounded-lg transition-all ${
                  role === 'TEACHER'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                I am an Educator
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@student.edu"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {role === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dyslexia Support Profile
                  </label>
                  <select
                    value={dyslexiaSeverity}
                    onChange={(e) => setDyslexiaSeverity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-semibold text-slate-700"
                  >
                    <option value="MILD">Mild Dyslexia Profile</option>
                    <option value="MODERATE">Moderate Dyslexia Profile</option>
                    <option value="SEVERE">Severe Dyslexia Profile</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating Account...' : 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-600 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
