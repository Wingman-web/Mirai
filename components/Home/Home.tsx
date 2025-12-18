import React from 'react'
import Hero from './Hero/Hero'
import { RevealZoom } from './Gateway/Gateway' 
import ScrollVideoComponent from './Mirai_Grace/Mirai_Grace'
import MiraiPodsIntro from './4_Pods/4_pods'
import MiraiPodsSlider from './Mirai_Pods_Slider/Pods_Slider'
import ClubhouseIntro from './4_Level_Clubhouse/4_Level_Clubhouse'
import MiraiClubhouse from './ClubeHouse_Img_controller/ClubeHouse_Controller'
import InteractiveMap from './Interative_Map/Interative_Map'
import ContactForm from './Contact_us/Contact_us'
import Footer from './Footer/Footer'
import SixthElement from './Sixth_Element/Sixth_element'


const Home = () => {
  return (
    <div>
      <Hero />
      <SixthElement />
      <RevealZoom />
      <ScrollVideoComponent />
      <MiraiPodsIntro />
      <MiraiPodsSlider />
      <ClubhouseIntro />
      <MiraiClubhouse />
      <InteractiveMap />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default Home