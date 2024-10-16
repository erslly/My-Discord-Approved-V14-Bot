import type { Embed, Message } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '..';
type RenderEmbedContext = RenderMessageContext & {
    index: number;
    message: Message;
};
export declare function renderEmbed(embed: Embed, context: RenderEmbedContext): Promise<React.JSX.Element>;
export {};
