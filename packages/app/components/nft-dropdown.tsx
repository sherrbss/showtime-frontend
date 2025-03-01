import { useMemo } from "react";
import { Linking, Platform } from "react-native";

import {
  MoreHorizontal,
  UserMinus,
  Flag,
  EyeOff,
  Copy,
  Slash,
  Refresh,
  Twitter,
  Showtime,
  Edit,
  QrCode,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { TW } from "@showtime-xyz/universal.tailwind";

import { useProfileTabType } from "app/context/profile-tabs-nft-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useHideNFT } from "app/hooks/use-hide-nft";
import { useRefreshMedadata } from "app/hooks/use-refresh-metadata";
import { useShareNFT } from "app/hooks/use-share-nft";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useSocialColor } from "app/hooks/use-social-color";
import { useUser } from "app/hooks/use-user";
import { scheme } from "app/lib/scheme";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import type { NFT } from "app/types";
import { isMobileWeb, isAndroid } from "app/utilities";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { OpenSea } from "design-system/icon";

import { MenuItemIcon } from "./dropdown/menu-item-icon";

type Props = {
  nft: NFT;
  shouldEnableSharing?: boolean;
  tw?: TW;
  iconColor?: string;
  iconSize?: number;
  edition?: CreatorEditionResponse;
};

function NFTDropdown({
  nft,
  shouldEnableSharing = true,
  tw = "",
  iconColor: iconColorProp,
  iconSize = 24,
  edition,
}: Props) {
  //#region hooks
  const { iconColor } = useSocialColor();

  const tabType = useProfileTabType();
  const { isAuthenticated, user } = useUser();
  const { unfollow, isFollowing } = useMyInfo();
  const { hideNFT, unhideNFT } = useHideNFT();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();

  const isCreatorDrop = nft.creator_airdrop_edition_address;
  const { shareNFT, shareNFTOnTwitter } = useShareNFT();
  const refreshMetadata = useRefreshMedadata();
  const navigateToLogin = useNavigateToLogin();
  //#endregion

  //#region variables
  const hasOwnership = nft.is_user_owner;
  const isSelf = user?.data?.profile?.profile_id === nft?.creator_id;

  const isFollowingUser = useMemo(
    () => nft.owner_id && isFollowing(nft.creator_id),
    [nft.creator_id, nft.owner_id, isFollowing]
  );
  const isBlocked = useMemo(
    () => getIsBlocked(nft.creator_id),
    [nft.creator_id, getIsBlocked]
  );
  //#endregion

  const isShareAPIAvailable = Platform.select({
    default: true,
    web: typeof window !== "undefined" && !!navigator.share,
  });

  const viewOnOpenSea = () => {
    // Todo: maybe need to use token_id from backend.
    const token_id = "1";
    const link = `https://opensea.io/assets/matic/${nft.contract_address}/${token_id}`;
    Linking.openURL(link);
  };

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Pressable tw={tw} accessibilityLabel="nft card item menu">
            <MoreHorizontal
              width={iconSize}
              height={iconSize}
              color={iconColorProp ?? iconColor}
            />
          </Pressable>
        </DropdownMenuTrigger>

        <DropdownMenuContent loop sideOffset={8}>
          {tabType && tabType !== "hidden" ? (
            <DropdownMenuItem
              onSelect={() => {
                hideNFT(nft.nft_id);
              }}
              key="hide"
            >
              <MenuItemIcon
                Icon={EyeOff}
                ios={{
                  name: "eye.slash",
                }}
              />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Hide
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {tabType && tabType === "hidden" ? (
            <DropdownMenuItem
              onSelect={() => {
                unhideNFT(nft.nft_id);
              }}
              key="unhide"
            >
              <MenuItemIcon Icon={EyeOff} ios={{ name: "eye" }} />
              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Unhide
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {(edition?.gating_type === "spotify_presave" ||
            edition?.gating_type === "music_presave") &&
          nft.creator_username === user?.data.profile.username ? (
            <DropdownMenuItem
              onSelect={() => {
                router.push(
                  "/drop/update/" +
                    edition.creator_airdrop_edition.contract_address
                );
                // unhideNFT(nft.nft_id);
              }}
              key="update"
            >
              <MenuItemIcon
                Icon={Edit}
                ios={{
                  name: "square.and.pencil",
                }}
              />
              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Update Spotify Link
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {isMobileWeb() ? (
            <DropdownMenuItem
              onSelect={() => {
                window.location.replace(`${scheme}://${getNFTSlug(nft)}`);

                setTimeout(function () {
                  window.open(
                    isAndroid()
                      ? "https://play.google.com/store/apps/details?id=io.showtime"
                      : "https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688",
                    "_blank"
                  );
                }, 2000);
              }}
              key="open-in-app"
            >
              <MenuItemIcon Icon={Showtime} />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Open in app
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          ) : null}

          {nft.multiple_owners_list &&
            nft.multiple_owners_list.length > 0 &&
            nft.contract_address && (
              <DropdownMenuItem onSelect={viewOnOpenSea} key="opensea">
                <MenuItemIcon
                  Icon={OpenSea}
                  ios={{
                    name: "arrow.right",
                  }}
                />
                <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                  View on OpenSea
                </DropdownMenuItemTitle>
              </DropdownMenuItem>
            )}

          {shouldEnableSharing && (
            <>
              {!isShareAPIAvailable && (
                <DropdownMenuItem
                  onSelect={() => shareNFTOnTwitter(nft)}
                  key="share-twitter"
                >
                  <MenuItemIcon Icon={Twitter} />

                  <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                    Share on Twitter
                  </DropdownMenuItemTitle>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => shareNFT(nft)} key="copy-link">
                <MenuItemIcon
                  Icon={Copy}
                  ios={{
                    name: "square.and.arrow.up",
                  }}
                />
                <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                  {isShareAPIAvailable ? "Share" : "Copy Link"}
                </DropdownMenuItemTitle>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            onSelect={() => {
              const as = `/qr-code-share/${nft?.contract_address}`;
              router.push(
                Platform.select({
                  native: as,
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      contractAddress: nft?.contract_address,
                      qrCodeShareModal: true,
                    },
                  } as any,
                }),
                Platform.select({
                  native: as,
                  web: router.asPath,
                }),
                { shallow: true }
              );
            }}
            key="qr-code"
          >
            <MenuItemIcon
              Icon={QrCode}
              ios={{
                name: "qrcode",
              }}
            />
            <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
              QR Code
            </DropdownMenuItemTitle>
          </DropdownMenuItem>

          {!isCreatorDrop && (
            <DropdownMenuItem
              onSelect={() => refreshMetadata(nft)}
              key="refresh-metadata"
            >
              <MenuItemIcon
                Icon={Refresh}
                ios={{
                  name: "arrow.triangle.2.circlepath",
                }}
              />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Refresh Metadata
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          )}

          {!hasOwnership && isFollowingUser && !isSelf && (
            <DropdownMenuItem
              onSelect={async () => {
                if (isAuthenticated) {
                  await unfollow(nft.creator_id);
                  // refresh();
                } else {
                  navigateToLogin();
                }
              }}
              key="unfollow"
            >
              <MenuItemIcon
                Icon={UserMinus}
                ios={{
                  name: "person.fill.badge.plus",
                }}
              />

              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Unfollow User
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          )}

          {!hasOwnership && !isSelf ? (
            <>
              <DropdownMenuItem
                className="danger"
                key="block"
                onSelect={() =>
                  toggleBlock({
                    isBlocked,
                    creatorId: nft.creator_id,
                    name: nft.creator_name,
                  })
                }
              >
                <MenuItemIcon
                  Icon={Slash}
                  ios={{
                    name: isBlocked ? "circle" : ("circle.slash" as any),
                  }}
                />
                <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                  {isBlocked ? "Unblock User" : "Block User"}
                </DropdownMenuItemTitle>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={async () => {
                  router.push(
                    {
                      pathname:
                        Platform.OS === "web" ? router.pathname : "/report",
                      query: {
                        ...router.query,
                        reportModal: true,
                        nftId: nft.nft_id,
                      },
                    },
                    Platform.OS === "web" ? router.asPath : undefined
                  );
                }}
                key="report"
              >
                <MenuItemIcon
                  Icon={Flag}
                  ios={{
                    name: "flag",
                  }}
                />
                <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                  Report
                </DropdownMenuItemTitle>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </>
  );
}

export { NFTDropdown };
