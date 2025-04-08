import React from 'react'

const Footer = () => {
  return (
    <div>
         <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; 2025 Shop App. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-gray-400">Chính sách bảo mật</a>
          <a href="#" className="hover:text-gray-400">Điều khoản dịch vụ</a>
          <a href="#" className="hover:text-gray-400">Liên hệ</a>
        </div>
      </div>
    </footer>
    </div>
  )
}

export default Footer
