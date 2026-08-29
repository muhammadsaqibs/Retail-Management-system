import { MailOpen, Phone, Award, Target } from 'lucide-react';
import React from 'react';

const About = () => {
  return (
    <div className='flex-1 lg:ml-64 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 flex items-center justify-center font-sans text-left'>
      <div className='w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100'>
        <div className='bg-[#13786E] p-8 md:p-12 text-center relative'>
          <h1 className='text-white text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase italic'>Apexiums Retail</h1>
          <p className='text-teal-100 font-bold uppercase tracking-widest text-[9px] md:text-[10px]'>Empowering Businesses through Technology</p>
        </div>
        <div className='p-6 md:p-12'>
          <p className='text-gray-600 text-base md:text-lg leading-relaxed mb-10 text-center md:text-left'>
            Apexiums Retail Management delivers innovative POS systems and digital ecosystems tailored to meet modern business needs. Our mission is to turn your ideas into digital reality.
          </p>
          <div className='flex items-center justify-center mb-10 md:mb-12'><div className='bg-teal-50 border border-teal-100 px-6 py-3 rounded-full flex items-center gap-3'><Target className='text-[#13786E]' size={20}/><span className='text-[#13786E] font-black text-[9px] md:text-[10px] uppercase tracking-widest italic'>Mission: Ideas into Reality</span></div></div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6'>
            <AboutCard icon={<MailOpen size={24}/>} title="Email Us" desc="Apexiums@gmail.com" />
            <AboutCard icon={<Phone size={24}/>} title="Call Us" desc="+92 340 5542097" />
            <AboutCard icon={<Award size={24}/>} title="Excellence" desc="POS Support" />
          </div>
        </div>
        <div className='bg-gray-50 p-4 text-center border-t'><p className='text-[8px] text-gray-400 font-black uppercase tracking-[4px]'>© 2024 Apexiums Technologies</p></div>
      </div>
    </div>
  )
}
const AboutCard = ({ icon, title, desc }) => (
  <div className='p-5 rounded-2xl bg-gray-50 flex flex-col items-center text-center hover:bg-white hover:shadow-lg transition-all border border-gray-100 flex-1'>
    <div className='text-[#13786E] mb-3'>{icon}</div><h4 className='font-black text-gray-800 text-[10px] uppercase mb-1'>{title}</h4><p className='text-[10px] text-gray-400 font-bold truncate w-full'>{desc}</p>
  </div>
);
export default About;