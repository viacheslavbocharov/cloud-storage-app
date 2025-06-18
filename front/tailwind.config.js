// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       keyframes: {
//       scroll: {
//         '0%': { transform: 'translateX(0)' },
//         '100%': { transform: 'translateX(-100%)' },
//       },
//     },
//     animation: {
//       scroll: 'scroll 6s linear infinite',
//     },
//     },
//   },
//   plugins: [],
//   darkMode: 'class'
// };


// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   safelist: [
//     'data-[state=open]:w-[300px]',
//     'data-[state=closed]:w-14',
//     'data-[state=open]:pl-[14px]',
//     'group-data-[state=open]:w-[300px]',
//     'group-data-[state=closed]:w-14',
//   ],
//   theme: {
//     extend: {
//       keyframes: {
//         scroll: {
//           '0%': { transform: 'translateX(0)' },
//           '100%': { transform: 'translateX(-100%)' },
//         },
//       },
//       animation: {
//         scroll: 'scroll 6s linear infinite',
//       },
//     },
//   },
//   plugins: [],
//   darkMode: 'class',
// };

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 6s linear infinite',
      },
    },
  },
  darkMode: 'class',
};


