import { type Message } from 'discord.js';
import type { RenderMessageContext } from '..';
import React from 'react';
export default function renderReply(message: Message, context: RenderMessageContext): Promise<React.JSX.Element | null>;
