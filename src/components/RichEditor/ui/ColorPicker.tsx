/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { JSX } from "react";
import "./ColorPicker.css";
import * as React from "react";
interface ColorPickerProps {
  colors: {
    font?: string;
    background?: string;
  };
  onChange?: (
    value: string,
    skipHistoryStack: boolean,
    skipRefocus: boolean,
    target: "font" | "background",
  ) => void;
  hideFontColor?: boolean;
  hideBackgroundColor?: boolean;
}

export const COLORS = {
  text: [
    { label: "기본", value: "#37352F", name: "default" },
    { label: "회색", value: "#9B9A97", name: "gray" },
    { label: "갈색", value: "#64473A", name: "brown" },
    { label: "주황색", value: "#D9730D", name: "orange" },
    { label: "노란색", value: "#DFAB01", name: "yellow" },
    { label: "초록색", value: "#0F7B6C", name: "green" },
    { label: "파란색", value: "#0B6E99", name: "blue" },
    { label: "보라색", value: "#6940A5", name: "purple" },
    { label: "분홍색", value: "#AD1A72", name: "pink" },
    { label: "빨간색", value: "#E03E3E", name: "red" },
  ],
  background: [
    { label: "기본", value: "transparent", name: "default" },
    { label: "회색 배경", value: "#EBEDED", name: "gray" },
    { label: "갈색 배경", value: "#E9E5E3", name: "brown" },
    { label: "주황 배경", value: "#FAEBDD", name: "orange" },
    { label: "노란 배경", value: "#FBF3DB", name: "yellow" },
    { label: "초록 배경", value: "#DDEDEA", name: "green" },
    { label: "파란 배경", value: "#DDEBF1", name: "blue" },
    { label: "보라 배경", value: "#EAE4F2", name: "purple" },
    { label: "분홍 배경", value: "#F4E2ED", name: "pink" },
    { label: "빨간 배경", value: "#FBE4E4", name: "red" },
  ],
};

export const BORDER_COLORS = {
  "#37352F": "#DDDDDD",
  "#9B9A97": "#D1D5DB",
  "#64473A": "#D1CBC8",
  "#D9730D": "#F1D1B5",
  "#DFAB01": "#E9D8A6",
  "#0F7B6C": "#B4D5D0",
  "#0B6E99": "#B6CED8",
  "#6940A5": "#D3C6E3",
  "#AD1A72": "#E8C9DD",
  "#E03E3E": "#F3C6C6",

  transparent: "#DDDDDD",
  "#EBEDED": "#D1D5DB",
  "#E9E5E3": "#D1CBC8",
  "#FAEBDD": "#F1D1B5",
  "#FBF3DB": "#E9D8A6",
  "#DDEDEA": "#B4D5D0",
  "#DDEBF1": "#B6CED8",
  "#EAE4F2": "#D3C6E3",
  "#F4E2ED": "#E8C9DD",
  "#FBE4E4": "#F3C6C6",
};

const WIDTH = 214;

export default function ColorPicker({
  colors,
  onChange,
  hideFontColor = false,
  hideBackgroundColor = false,
}: Readonly<ColorPickerProps>): JSX.Element {
  const onColorSelect = (value: string, target: "font" | "background") => {
    if (onChange) {
      onChange(value, false, false, target);
    }
  };

  return (
    <div className="color-picker-wrapper" style={{ width: WIDTH }}>
      {/* 텍스트 색상 섹션 */}
      {!hideFontColor && (
        <>
          <div className="color-picker-section">
            <h4 className="color-picker-label">텍스트 색상</h4>
            <div className="color-picker-grid">
              {COLORS.text.map((tColor) => (
                <button
                  key={`text-${tColor.name}`}
                  className={`color-btn ${colors.font === tColor.value ? "active" : ""}`}
                  title={tColor.label}
                  style={{
                    borderColor:
                      BORDER_COLORS[
                        tColor.value as keyof typeof BORDER_COLORS
                      ] || "#ddd",
                  }}
                  onClick={() => onColorSelect(tColor.value, "font")}
                >
                  <span className="text-icon" style={{ color: tColor.value }}>
                    A
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="divider"></div>
        </>
      )}

      {/* 배경 색상 섹션 */}
      <div className="color-picker-section">
        <h4 className="color-picker-label">배경 색상</h4>
        <div className="color-picker-grid">
          {COLORS.background.map((bgColor) => (
            <button
              key={`bg-${bgColor.name}`}
              className={`color-btn bg-box ${colors.background === bgColor.value ? "active" : ""}`}
              title={bgColor.label}
              style={{
                backgroundColor: bgColor.value,
                borderColor:
                  BORDER_COLORS[bgColor.value as keyof typeof BORDER_COLORS] ||
                  "#ddd",
              }}
              onClick={() => onColorSelect(bgColor.value, "background")}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function parseAllowedColor(input: string) {
  return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : "";
}
