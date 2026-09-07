function Header() {
  return (
    <header className="text-center space-y-2 py-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-indigo-400">
        AI Code Explainer
      </h1>
      <p className="text-slate-400 text-sm md:text-base">
        Paste your code below to get a simple, line-by-line explanation.
      </p>
    </header>
  );
}

export default Header;