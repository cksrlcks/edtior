/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';

import ColorPicker from './ColorPicker';
import DropDown from './DropDown';

type Props = {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  colors: {
    font: string;
    background: string;
  };
  onChange?: (
    color: string,
    skipHistoryStack: boolean,
    skipRefocus: boolean,
    target: 'font' | 'background',
  ) => void;
  customLabel?: React.ReactNode;
};

export default function DropdownColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  colors,
  onChange,
  ...rest
}: Props) {
  return (
    <DropDown
      {...rest}
      disabled={disabled}
      stopCloseOnClickSelf={stopCloseOnClickSelf}>
      <ColorPicker colors={colors} onChange={onChange} />
    </DropDown>
  );
}
