import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import Canvas from "./Canvas";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <Canvas />
    </main>
  );
}
