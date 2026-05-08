import { Cormorant_Garamond, Josefin_Sans, Dancing_Script } from 'next/font/google';

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-josefin',
  display: 'swap',
});

export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dancing',
  display: 'swap',
});
