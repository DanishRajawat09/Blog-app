import Footer from "../components/Footer";
import BlogList from "../components/HomeComponents/BlogList";
import Hero from "../components/HomeComponents/Hero";
import NewsLetter from "../components/HomeComponents/NewsLetter";
import Navbar from "../components/Navbar";

const Home = () => {
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
