import { useFonts, Merriweather_400Regular, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { useFonts as useRobotoFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useFonts as useNotoSansJPFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';

export const useCustomFonts = () => {
  const [merriweatherLoaded] = useFonts({
    Merriweather_400Regular,
    Merriweather_700Bold,
  });

  const [robotoLoaded] = useRobotoFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const [notoSansJPLoaded] = useNotoSansJPFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  return merriweatherLoaded && robotoLoaded && notoSansJPLoaded;
};
