import Navbar from "./Navbar/Navbar";
import { Footer } from "./Footer";

export {
  Navbar,
  Footer
}

export function Layout({ children }: any) {
  return (
    <>
      <Navbar />
        <main>{children}</main>
      <Footer />
    </>
  )
}
