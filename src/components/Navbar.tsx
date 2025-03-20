const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="h-12 w-12">
            <img
              src="https://i5.walmartimages.com/seo/Rick-and-Morty-Metal-Wall-Art_bcc4085e-c311-4886-a7a4-aa58127883d7.5958f8a36f96aa4c08dbc4a8a580e57c.png?odnHeight=640&odnWidth=640&odnBg=FFFFFF"
              alt="Rick and Morty"
              className="h-full w-full object-contain"
            />
          </a>
          <ul className="flex gap-8">
            <li>
              <a href="#characters">Characters</a>
            </li>
            <li>
              <a href="#locations">Locations</a>
            </li>
            <li>
              <a href="#episodes">Episodes</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
