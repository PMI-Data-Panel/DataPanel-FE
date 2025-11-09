export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        "로컬스토리지에 아이템을 저장하는 도중, 오류가 발생했습니다.:",
        error
      );
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null; // 저장된 아이템이 있다면 파싱해서 반환
    } catch (error) {
      console.error(
        "로컬스토리지에서 아이템을 가져오는 도중, 오류가 발생했습니다.:",
        error
      );
      return null;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(
        "로컬스토리지 아이템 삭제 중, 오류가 발생하였습니다: ",
        error
      );
    }
  };

  return { setItem, getItem, removeItem };
};
