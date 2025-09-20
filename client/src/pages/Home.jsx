import Footer from "../components/Footer";
import BlogList from "../components/HomeComponents/BlogList";
import Hero from "../components/HomeComponents/Hero";
import NewsLetter from "../components/HomeComponents/NewsLetter";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/appContext";

const Home = () => {
 const {admin} = useAppContext()
 console.log(admin);
 
  return (
    <>
      <Navbar />
      <Hero />
      <BlogList />
      <NewsLetter />
      <Footer />
    </>
  );
};

export default Home;
