import { type MessageActionRowComponent, type ActionRow } from 'discord.js';
import React from 'react';
export default function renderComponentRow(row: ActionRow<MessageActionRowComponent>, id: number): React.JSX.Element;
export declare function renderComponent(component: MessageActionRowComponent, id: number): React.JSX.Element | undefined;
