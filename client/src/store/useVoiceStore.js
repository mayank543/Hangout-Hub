// // store/useVoiceStore.js
// import { create } from "zustand";

// const useVoiceStore = create((set) => ({
//   roomId: null,
//   isInVoiceRoom: false,

//   joinRoom: (id) =>
//     set(() => ({
//       roomId: id,
//       isInVoiceRoom: true,
//     })),

//   leaveRoom: () =>
//     set(() => ({
//       roomId: null,
//       isInVoiceRoom: false,
//     })),
// }));

// export default useVoiceStore;