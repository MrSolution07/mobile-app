import { useFonts, Merriweather_400Regular, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { useFonts as useRobotoFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useFonts as useNotoSansJPFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { useFonts as useMavenProFonts, MavenPro_400Regular, MavenPro_700Bold } from '@expo-google-fonts/maven-pro';
import { useFonts as useVarelaRoundFonts, VarelaRound_400Regular } from '@expo-google-fonts/varela-round';

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

  const [mavenProLoaded] = useMavenProFonts({
    MavenPro_400Regular,
    MavenPro_700Bold, 
  });

  const [varelaRoundLoaded] = useVarelaRoundFonts({
    VarelaRound_400Regular,
  });

  return (
    merriweatherLoaded &&
    robotoLoaded &&
    notoSansJPLoaded &&
    mavenProLoaded &&
    varelaRoundLoaded
  );
};
