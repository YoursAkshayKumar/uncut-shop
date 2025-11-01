const menu_data = [
  {
    id: 1,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    title: 'About Us',
    link: '/about'
  },
  {
    id: 3,
    title: 'Shop',
    link: '/shop'
  },
  {
    id: 4,
    hasDropdown: true,
    title: 'Collections',
    link: '/shop',
    submenus: [
      { title: 'Suits', link: '/shop?category=suits'},
      { title: 'Kurtis', link: '/shop?category=kurties'},
      { title: 'Sweaters', link: '/shop?category=sweaters'},
      { title: 'Coats', link: '/shop?category=coats'},
      { title: 'Shirts', link: '/shop?category=shirts'},
      { title: 'Pents', link: '/shop?category=pents'},
      { title: 'Saadi', link: '/shop?category=saadi'},
      { title: 'Kurta Pyjamas', link: '/shop?category=kurta-pyjamas'},
      { title: 'Jeans', link: '/shop?category=jeans'},
      { title: 'T-Shirts', link: '/shop?category=t-shirts'},
    ]
  },
  // {
  //   id: 4,
  //   hasDropdown: true,
  //   title: 'Pages',
  //   link: '/about',
  //   submenus: [
  //     { title: 'FAQs', link: '/faq' },
  //     { title: 'Privacy & Policy', link: '/policy' },
  //     { title: 'Terms & Conditions', link: '/terms' },
  //     { title: 'Login', link: '/login' },
  //     { title: 'Register', link: '/register' },
  //     { title: 'Forgot Password', link: '/forgot' },
  //     { title: 'My Cart', link: '/cart' },
  //     { title: 'My Wishlist', link: '/wishlist' },
  //     { title: 'Checkout', link: '/checkout' },
  //     { title: 'Error 404', link: '/404' },
  //   ]
  // },
  {
    id: 5,
    title: 'Contact us',
    link: '/contact'
  },
]

export default menu_data;
