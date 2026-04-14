'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

const KontakPage = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('kontak')
        .select('*')
        .single()

      if (error) console.error(error)
      if (data) setData(data)

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>
  }

  return (
    <div className="pt-[180px] pb-[100px] bg-gray-50 dark:bg-darklight">
      <div className="container">

        {/* TITLE */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900">
            Have Questions? <br />
            <span className="text-primary">We're Here To Help!</span>
          </h2>
        </div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        
        >

          {/* TOP CONTENT */}
          <div className="grid md:grid-cols-2 gap-10 p-10">

            {/* LEFT */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-500">Email</p>
                <h4 className="font-semibold text-lg">
                  {data.email}
                </h4>
              </div>

              <div>
                <p className="text-gray-500">Location</p>
                <h4 className="font-semibold text-lg">
                  {data.alamat}
                </h4>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-500">Call Us</p>
                <h4 className="font-semibold text-lg">
                  {data.hp}
                </h4>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Follow Us</p>
                <div className="flex gap-4">

                  {data.twitter && (
                    <a href={data.twitter} target="_blank">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary hover:text-white transition">
                        <Icon icon="mdi:twitter" />
                      </div>
                    </a>
                  )}

                  {data.facebook && (
                    <a href={data.facebook} target="_blank">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary hover:text-white transition">
                        <Icon icon="mdi:facebook" />
                      </div>
                    </a>
                  )}

                  {data.instagram && (
                    <a href={data.instagram} target="_blank">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary hover:text-white transition">
                        <Icon icon="mdi:instagram" />
                      </div>
                    </a>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="w-full h-[400px] relative">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
              src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`}
            />

            {/* LABEL */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-primary">
              We Are Here
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}

export default KontakPage