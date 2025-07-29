import CTASection from '@/components/landingpage/CTASection'
import FeaturesSection from '@/components/landingpage/FeaturesSection'
import HeroSection from '@/components/landingpage/HeroSection'
import HowItWorks from '@/components/landingpage/HowItWorks'
import React from 'react'

function HomePage() {
  return (
    <>
    <HeroSection/>
    <FeaturesSection/>
    <HowItWorks/>
    <CTASection/>
    </>
  )
}

export default HomePage