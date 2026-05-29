export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Frontend Projesi Başarıyla Başlatıldı
        </p>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          Vesta Teknoloji
        </h1>
        <p className="text-lg text-slate-400 max-w-md text-center">
          Next.js (TypeScript & Tailwind) önyüz mimarisi kuruldu. Sırada Java Spring Boot backend bağlantısı var.
        </p>
        
        <div className="mt-10 p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-emerald-400 font-mono text-sm animate-pulse">
          ⚡ Java API'den veri bekleniyor...
        </div>
      </div>
    </main>
  );
}