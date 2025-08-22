import React from 'react'
import { Customizeproduct,Customerreview, PromoSection ,Followus,NewArrivals,Scrollbar,ShopByCategory,NewTrending } from '../index';

function Home() {
  return (
    <div>
      <Scrollbar />
      <ShopByCategory />
      <NewArrivals />
      <Customizeproduct />
      < PromoSection />
      <NewTrending />
      <Customerreview />
      <Followus /> 
    </div>
  )
}

export default Home