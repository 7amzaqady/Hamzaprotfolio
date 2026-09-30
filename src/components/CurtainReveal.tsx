"use client";

import * as React from "react";
import type { AnimationOptions } from "framer-motion";

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span"] as const;

type Props = {
    text: string;
    font?: React.CSSProperties;
    color: string;
    tag: string;

    direction:
        | "center-horizontal"
        | "center-vertical"
        | "left-to-right"
        | "right-to-left"
        | "top-to-bottom"
        | "bottom-to-top";

    transition: AnimationOptions;
};

const INSET_MAP: Record<string, string> = {
    "center-horizontal": "inset(0% 50% 0% 50%)",
    "center-vertical": "inset(50% 0% 50% 0%)",
    "left-to-right": "inset(0% 100% 0% 0%)",
    "right-to-left": "inset(0% 0% 0% 100%)",
    "top-to-bottom": "inset(0% 0% 100% 0%)",
    "bottom-to-top": "inset(100% 0% 0% 0%)",
};

function __OriginkitBase_CurtainReveal({
    text = "Curtain Reveal",
    font = {
        fontFamily: "Inter",
        fontWeight: 700,
        fontSize: 120,
        lineHeight: "1.5em",
        letterSpacing: "0em",
        textAlign: "left",
    },
    color = "#FFFFFF",
    tag = "h3",
    direction = "center-horizontal",
    transition = {
        type: "tween",
        stiffness: 800,
        damping: 60,
        mass: 1,
        ease: "easeInOut",
        duration: 1,
    },
}: Partial<Props>) {
    const startClip = INSET_MAP[direction] || INSET_MAP["center-horizontal"];

    const fontStyles = (font ?? {}) as React.CSSProperties;
    const safeTag = (TAGS as readonly string[]).includes(tag) ? tag : "h3";
    const Tag = safeTag as (typeof TAGS)[number];
    const Wrapper = safeTag === 'span' ? 'span' : 'div';

    return (
        <Wrapper
            style={{
                width: "100%",
                display: "flex",
                justifyContent:
                    fontStyles.textAlign === "right"
                        ? "flex-end"
                        : fontStyles.textAlign === "center"
                          ? "center"
                          : "flex-start",
                overflow: "visible",
            }}
        >
            <Tag
                className="curtain-text"
                style={{
                    margin: 0,
                    display: "inline-block",
                    whiteSpace: "pre-wrap",
                    ...fontStyles,
                    color,
                    '--curtain-from': startClip,
                    animation: `curtain-text-reveal ${transition.duration ?? 1}s cubic-bezier(.16,1,.3,1) ${transition.delay ?? 0}s both`,
                } as React.CSSProperties}
            >
                {text}
            </Tag>
        </Wrapper>
    );
}

const __originkitPresetProps = {
  "text": "MASK TEXT REVEAL",
  "font": {
    "variant": "Regular",
    "fontSize": "80px",
    "textAlign": "center",
    "fontFamily": "Inter",
    "fontWeight": 700,
    "lineHeight": "1em",
    "letterSpacing": "-0.04em"
  },
  "tag": "h1"
};

export default function CurtainReveal(props: Record<string, unknown>) {
  return <__OriginkitBase_CurtainReveal {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
