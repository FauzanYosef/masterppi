import Galery from '../../components/Home/Gallery'
import Hero from '../../components/Home/Hero'
import Partner from '../../components/Home/Partner'
import News from '../../components/Home/News'
import Activity from '../../components/Home/Activity'
import Registration from '../../components/Home/Registration'
import Sambutan from '../../components/Home/Sambutan'
import Sejarah from '../../components/Home/Sejarah'

export default function Home() {
  return (
    <main>
      <Hero />
      <Sambutan />
      <Sejarah />
      <News />
      <Activity />
      <Registration />
      <Galery />
      <Partner />
    </main>
  )
}
