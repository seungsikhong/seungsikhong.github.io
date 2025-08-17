import ReadingLayout from '@/components/ReadingLayout'
import { Mail, GitHub, Linkedin, MessageCircle, Send } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

export default function ContactPage() {
  return (
    <ReadingLayout showSidebars={false}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 헤더 */}
        <PageHeader
          title="Contact"
          description="궁금한 점이나 제안사항이 있으시면 언제든 연락해주세요!"
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 연락처 정보 */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                연락처 정보
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email</h3>
                    <p className="text-slate-600 dark:text-slate-400">seungsik.hong@example.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <GitHub className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">GitHub</h3>
                    <a 
                      href="https://github.com/seungsikhong" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      github.com/seungsikhong
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">LinkedIn</h3>
                    <a 
                      href="https://linkedin.com/in/seungsikhong" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      linkedin.com/in/seungsikhong
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 응답 시간 정보 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                응답 시간
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• 일반 문의: 24시간 이내</li>
                <li>• 기술 관련 질문: 48시간 이내</li>
                <li>• 프로젝트 제안: 72시간 이내</li>
              </ul>
            </div>
          </div>

          {/* 연락 폼 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              메시지 보내기
            </h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="문의 제목을 입력하세요"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  메시지
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="메시지를 입력하세요..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
              >
                <Send className="w-4 h-4" />
                <span>메시지 보내기</span>
              </button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                폼 제출은 현재 개발 중입니다. 
                직접 이메일로 연락해주시면 더 빠른 응답을 받으실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ReadingLayout>
  )
}
