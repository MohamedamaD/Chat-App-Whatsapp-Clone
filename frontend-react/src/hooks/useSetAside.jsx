import { useDispatch } from "react-redux";
import { setAside, setGroup } from "../store/slices/appSlice";

export const useSetAside = (asideOption, group) => {
  const dispatch = useDispatch();

  const setAsideOption = (asideOption, group) => {
    dispatch(setAside(asideOption));

    if (group) {
      dispatch(setGroup(group));
    }
  };

  return setAsideOption;
};
