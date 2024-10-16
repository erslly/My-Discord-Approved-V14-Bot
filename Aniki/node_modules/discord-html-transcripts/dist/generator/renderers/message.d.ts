import type { Message } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '..';
export default function renderMessage(message: Message, context: RenderMessageContext): Promise<React.JSX.Element | undefined>;
