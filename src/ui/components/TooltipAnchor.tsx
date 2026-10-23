import {
    ComponentRef,
    ReactNode,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

type Rect = { x: number; y: number; width: number; height: number };

const MARGIN = 8;

function Bubble({ anchor, text }: { anchor: Rect; text: string }) {
  const bubbleRef = useRef<ComponentRef<typeof View>>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const { width: screenWidth } = useWindowDimensions();

  useLayoutEffect(() => {
    const rect = bubbleRef.current?.getBoundingClientRect();
    if (rect) {
      const { width, height } = rect;
      setSize({ width, height });
    }
    // bubbleRef.current?.measure((_x, _y, width, height) => {
    //   setSize({ width, height });
    // });
  }, [text]);

  let left = 0;
  let top = 0;
  if (size) {
    const centered = anchor.x + anchor.width / 2 - size.width / 2;
    left = Math.min(
      Math.max(centered, MARGIN),
      screenWidth - size.width - MARGIN,
    );
    top = anchor.y - size.height - MARGIN;
  }

  return (
    <View
      ref={bubbleRef}
      style={[styles.bubble, { left, top, opacity: size ? 1 : 0 }]}
    >
      <Text style={styles.bubbleText}>{text}</Text>
    </View>
  );
}

export function TooltipAnchor({
  children,
  text,
}: {
  children: ReactNode;
  text: string;
}) {
  const anchorRef = useRef<ComponentRef<typeof View>>(null);
  const [anchor, setAnchor] = useState<Rect | null>(null);

  const open = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    // anchorRef.current?.measureInWindow((x, y, width, height) => {
    if (rect) {
      const { x, y, width, height } = rect;
      setAnchor({ x, y, width, height });
    }
    // });
  };

  return (
    <>
      <Pressable onLongPress={open}>
        <View ref={anchorRef} collapsable={false}>
          {children}
        </View>
      </Pressable>
      <Modal
        transparent
        visible={anchor !== null}
        onRequestClose={() => setAnchor(null)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setAnchor(null)}
        >
          {anchor && <Bubble anchor={anchor} text={text} />}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    maxWidth: 260,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  bubbleText: { color: "white" },
});
