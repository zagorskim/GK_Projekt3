import {useRecoilValue, selector, atom, useRecoilState} from 'recoil'

export const canvas1Data = atom({
    key: "canvas1Data",
    default: [,],
});

export const teamNameSelector = selector({
key: "teamNameSelector",
get:  ({ get }) => {
    
    },
});