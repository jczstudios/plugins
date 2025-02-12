import type { Awaitable, NonNullObject } from '@sapphire/utilities';
import type { WatchOptions } from 'chokidar';
import type { Guild, Message, MessageOptions, StageChannel, StoreChannel, User, VoiceChannel } from 'discord.js';
import type { InitOptions, StringMap, TFunctionKeys, TOptions } from 'i18next';
import type { i18nextFsBackend } from 'i18next-fs-backend';

/**
 * Configure whether to use Hot-Module-Replacement (HMR) for your i18next resources using these options. The minimum config to enable HMR is to set `enabled` to true. Any other properties are optional.
 * @since 2.2.0
 */
export interface HMROptions {
	/**
	 * HMR status for the i18next plugin.
	 * @default false
	 */
	enabled: boolean;

	/**
	 * Languages that will be reloaded when updating the languages directory.
	 * @default All languages that are automatically resolved from your folder setup
	 */
	languages?: string | string[];

	/**
	 * Namespaces that will be reloaded when updating the languages directory.
	 * @default All namespaces that are automatically resolved from your languages folder setup
	 */
	namespaces?: string | string[];

	/**
	 * HMR options
	 */
	options?: WatchOptions;
}

/**
 * Used to dynamically add options based on found languages in {@link InternationalizationHandler#init}.
 * @since 1.1.0
 * @private
 */
export type DynamicOptions<T extends InitOptions> = (namespaces: string[], languages: string[]) => T;

/**
 * The options used in {@link InternationalizationHandler}.
 * @since 1.0.0
 */
export interface InternationalizationOptions {
	/**
	 * Used as the default 2nd to last fallback locale if no other is found.
	 * It's only followed by "en-US".
	 * @since 1.0.0
	 */
	defaultName?: string;

	/**
	 * The options passed to `backend` in `i18next.init`.
	 * @since 1.0.0
	 */
	backend?: i18nextFsBackend.i18nextFsBackendOptions;

	/**
	 * The options passed to `i18next.init`.
	 * @since 1.0.0
	 */
	i18next?: InitOptions | DynamicOptions<InitOptions>;

	/**
	 * The directory in which "i18next-fs-backend" should search for files.
	 * @default `rootDirectory/language`
	 * @since 1.0.0
	 */
	defaultLanguageDirectory?: string;

	/**
	 * The default value to be used if a specific language key isn't found.
	 * Defaults to "default:default".
	 * @since 1.0.0
	 */
	defaultMissingKey?: string;

	/**
	 * The default NS that is prefixed to all keys that don't specify it.
	 * Defaults to "default".
	 * @since 1.0.0
	 */
	defaultNS?: string;

	/**
	 * Array of formatters to add to i18n.
	 *
	 * @since 2.0.0
	 * @default []
	 */
	formatters?: I18nextFormatters[];

	/**
	 * Reload languages and namespaces when updating the languages directory.
	 *
	 * @since 2.2.0
	 */
	hmr?: HMROptions;

	/**
	 * A function that is to be used to retrieve the language for the current context.
	 * Context exists of a {@link Guild `guild`}, a {@link DiscordChannel `channel`} and a {@link User `user`}.
	 *
	 * If this is not set, then the language will always be the default language.
	 *
	 * This will be inserted for {@link InternationalizationHandler.fetchLanguage}.
	 * @since 2.0.0
	 * @default () => InternationalizationOptions.defaultName
	 */
	fetchLanguage?: (context: InternationalizationContext) => Awaitable<string | null>;
}

export type TextBasedDiscordChannel = Message['channel'];
export type DiscordChannel = TextBasedDiscordChannel | StoreChannel | StageChannel | VoiceChannel;

/**
 * Context for {@link InternationalizationHandler.fetchLanguage} functions.
 * This context enables implementation of per-guild, per-channel, and per-user localization.
 */
export interface InternationalizationContext {
	guild: Guild | null;
	channel: DiscordChannel | null;
	author: User | null;
}

export interface InternationalizationClientOptions {
	i18n?: InternationalizationOptions;
}

export interface I18nextFormatters {
	name: string;
	format(value: any, lng: string | undefined, options: any): string;
}

export interface LocalizedMessageOptions<TKeys extends TFunctionKeys = string, TInterpolationMap extends NonNullObject = StringMap>
	extends PartialLocalizedMessageOptions<TInterpolationMap> {
	keys: TKeys | TKeys[];
}

export interface PartialLocalizedMessageOptions<TInterpolationMap extends NonNullObject = StringMap> extends Omit<MessageOptions, 'content'> {
	formatOptions?: TOptions<TInterpolationMap>;
}

export type ChannelTarget = Message | DiscordChannel;
export type Target = ChannelTarget | Guild;
