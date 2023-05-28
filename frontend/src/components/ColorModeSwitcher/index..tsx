import { useColorMode, Switch } from "@chakra-ui/react"

export default function ColorModeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Switch
      colorScheme="green"
      isChecked={colorMode === "dark"}
      onChange={toggleColorMode}
    />
  )
}
