import { useRef, useEffect, memo } from "react";
import { Box, BoxProps } from "@mui/material";

interface FlexScrollBoxProps extends BoxProps {
  isLoading: boolean;
}

function FlexScrollBox(props: FlexScrollBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const { overflow: _1, ref: _2, isLoading, children, ...childProps } = props;

  useEffect(() => {
    const handleResize = () => {
      const listBoxOuter = containerRef.current;
      const listBox = childRef.current;
      if (listBox && listBoxOuter) {
        const lastScrollY = window.scrollY;
        listBox.style.height = "0px";
        const newHeight = listBoxOuter.clientHeight;
        if (newHeight > 200) listBox.style.height = newHeight.toString() + "px";
        else {
          listBox.style.height = "200px";
          window.scroll(0, lastScrollY);
        }
      }
    };
    if (!isLoading) {
      handleResize();
      window.removeEventListener("resize", handleResize);
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoading]);

  return (
    <Box
      border="2px solid #0085FF"
      borderRadius={3}
      flex={1}
      overflow="hidden"
      ref={containerRef}
    >
      <Box overflow="auto" ref={childRef} {...childProps}>
        {children}
      </Box>
    </Box>
  );
}

export default memo(FlexScrollBox);
