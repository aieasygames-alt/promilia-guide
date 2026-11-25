---
contentId: "requirements"
locale: "en"
slug: "requirements"
section: "guides"
title: "Azur Promilia System Requirements & Storage: PC, Android, iOS"
description: "Azur Promilia PC, Android and iPhone requirements. Regional FAQs recommend over 55GB free on mobile and 120GB on PC; compare RAM, chips and store download sizes."
author: "Promilia Guide"
publishedAt: "2026-11-25"
updatedAt: "2026-11-25"
gameVersion: "Pre-launch / regional FAQs checked November 24, 2026"
gameRegion: "Japan and mainland China, described separately"
verification: "official"
status: "published"
sourceRefs:
  - "cn-ios-store-followup-2026-11-24"
claimRefs:
  - "cn-ios-compatibility"
  - "cn-platform-details"
  - "jp-platform-plan"
  - "jp-platform-details"
  - "cn-public-launch-requirements"
  - "jp-public-launch-requirements"
  - "cn-public-launch-platform-rules"
  - "jp-public-launch-platform-rules"
  - "jp-ios-store-metadata"
  - "jp-launch-troubleshooting"
  - "cn-launch-troubleshooting"
  - "cn-login-support-rules"
claimRevisions:
  cn-ios-compatibility: 1
  cn-platform-details: 3
  jp-platform-plan: 1
  jp-platform-details: 3
  cn-public-launch-requirements: 1
  jp-public-launch-requirements: 1
  cn-public-launch-platform-rules: 1
  jp-public-launch-platform-rules: 1
  jp-ios-store-metadata: 1
  jp-launch-troubleshooting: 1
  cn-launch-troubleshooting: 1
  cn-login-support-rules: 1
sourceRevision: 10
translatedFromRevision: 10
translationStatus: "published"
reviewer: "Project owner (publication authorized in conversation)"
reviewedAt: "2026-11-25"
aliases:
  - "Azur Promilia"
  - "azurpromilia"
  - "azure promilia"
  - "Azur Promilia storage"
  - "Azur Promilia minimum specs"
related:
  - "global-release"
  - "download"
revisions:
  - date: "2026-11-25"
    note: "Published the English launch guide using the existing regional source checks. The project owner requested creation and production deployment in this conversation; this records publication authorization, not an independent language review or a completed installation/gameplay test."
order: 3
minutes: 8
---

## How much storage does Azur Promilia need?

**The November 24 Japan and China launch FAQs each recommend more than 55GB free storage on Android/iOS and more than 120GB on PC, with an SSD recommended for PC.** These are recommended free-space allowances before installation. They are not measured download sizes, final installed sizes or a separately stated hard minimum.

The China FAQ also recommends more than 55GB free for HarmonyOS. Keep that platform separate from Japan's published Android/iOS/Windows requirements.

| Platform | Official recommended free space | What the number means |
| --- | --- | --- |
| Android / iOS, Japan and China | More than 55GB | Free storage to prepare before installing and downloading resources |
| PC, Japan and China | More than 120GB; SSD recommended | Free space on the intended installation drive |
| HarmonyOS, China FAQ only | More than 55GB | China's separately listed platform recommendation |

Sources: [Japan launch FAQ](https://azurpromilia.jp/contact) and [China launch FAQ](https://azurpromilia.manjuu.com/home/news/detail/912070871064121344/), checked independently on November 24, 2026.

## Azur Promilia PC system requirements

The Japan FAQ lists the following Windows requirements. The China FAQ independently gives the same PC OS, DirectX, CPU, GPU, RAM and recommended-space values.

| Component | Minimum | Recommended |
| --- | --- | --- |
| Operating system | Windows 10 64-bit or later | — |
| Graphics API | DirectX 11.1 or later | — |
| CPU | Intel Core i5-9400F or equivalent | Intel Core i7-10700K or equivalent or better |
| GPU | NVIDIA GeForce GTX 1060 or equivalent | NVIDIA GeForce RTX 2060 or equivalent or better |
| RAM | 16GB | 16GB or more |
| Storage | No separate minimum-space figure in these FAQs | More than 120GB free; SSD recommended |

The recommendations do not establish a tested resolution, graphics preset or frame rate. This guide has not benchmarked the game. A GPU with a similar name is not automatically equivalent; compare the actual hardware rather than relying on the model-number range.

## Android minimum and recommended requirements

The Japan and China FAQs list the same Android values below. Installation eligibility for a particular store account remains a separate check.

| Component | Minimum | Recommended |
| --- | --- | --- |
| OS | Android 10.0 or later | — |
| Chipset | Snapdragon 855, Dimensity 1000+, Kirin 990 or equivalent or better | Snapdragon 8 Gen 1, Dimensity 9000+ or equivalent or better |
| RAM | 6GB | 8GB or more |
| Storage | No separate minimum-space figure | More than 55GB free |

RAM and storage are different: the 55GB figure refers to space for files, not working memory. Reaching the minimum does not guarantee that a device will avoid heat, slowdowns or frame drops.

## iPhone, iOS and iPad requirements

Japan's FAQ lists **iOS 15.0 or later**, **iPhone 12 Pro as the minimum model**, and **iPhone 13 Pro or later as recommended**, with more than 55GB free storage.

The China FAQ independently lists those same OS, iPhone-model and storage values. It additionally lists iOS RAM as **6GB minimum and 8GB or more recommended**. Those are fields in the China announcement; this guide preserves them as written rather than deriving a device's physical RAM from its model name.

Japan's FAQ does not provide a separate iOS RAM row or a separate recommended iPad model. Do not transfer the China RAM field into Japan's requirements. A store compatibility label or iPad screenshot is also not a performance recommendation for a particular iPad.

If your device is an iPad, check the current regional store compatibility and seek a model-specific official requirement. This guide has not verified an iPad performance test.

## HarmonyOS requirements: China only

The China FAQ separately lists HarmonyOS. These values do not establish a Japan HarmonyOS release.

| Field | China FAQ requirement / recommendation |
| --- | --- |
| OS | HarmonyOS 5.0 or later |
| Chipset | Kirin 9020 or equivalent or better recommended |
| RAM | 12GB or more recommended |
| Storage | More than 55GB free recommended |

Use the official regional distribution route. The existence of an Android download button does not prove that it is the HarmonyOS package.

## Why is the App Store size much smaller than 55GB?

The store's base-app payload and the FAQ's recommended free space describe different stages.

| Checked value | Source / meaning | What it does not establish |
| --- | --- | --- |
| 3.9GB, version 1.0.1 | China App Store distribution display checked November 24 | Complete resources, Japan app size or final installed space |
| 3,644,462,080 bytes, about 3.64GB in decimal units; version 1.0.0 | Japan [Apple metadata lookup](https://itunes.apple.com/lookup?id=6787982572&country=jp), checked November 24 | Full game size, additional-resource size or personal installation eligibility |
| More than 55GB mobile / 120GB PC | Regional FAQ recommended free space | An exact download amount or measured final installed size |

Both FAQs describe additional resources after the base client. Do not add the store payload to the free-space recommendation and call the result a “total download.” Sizes may change with later versions; use the live client prompts for the actual download you are offered.

Our Japan App Store web check redirected to Today, so the Japan payload above comes from Apple's metadata response. Its `releaseDate` field is not evidence of a server opening time. We have not installed the game or measured extraction space and final disk usage.

## How to check your device before downloading

1. **Windows:** record the OS, CPU and RAM from system information; check the GPU in Task Manager. In File Explorer, check free space on the actual installation drive and confirm whether it is an SSD.
2. **Android / HarmonyOS:** record the device model, OS, chipset, RAM and free storage. Do not count RAM expansion as equivalent to physical RAM without official support.
3. **iPhone / iPad:** check the model and OS in Settings → General → About, then check free storage. Treat iPad recommendations as unverified unless a regional source supplies them.
4. **Account and region:** confirm the intended regional client before downloading. A store page opening does not establish device performance or login eligibility.

Continue with the [official PC and mobile download guide](/en/guides/download/) once those checks are complete.

## Enough space, but the game will not load?

Record the symptom before changing hardware. An installation error, slow startup, a crash during play and a blocked login need different checks.

- **Insufficient-space error:** check the target drive, not the combined free space of all disks. The FAQs recommend freeing space or choosing a larger installation destination.
- **Slow PC loading:** the Japan FAQ recommends an SSD and enough space. It does not guarantee a loading time.
- **Repeated crashes during play:** both regional FAQs advise restarting the device, then starting the game; contact the relevant support service if the issue continues.
- **Login blocked after downloading:** check the current service announcement and account rules. China requires real-name verification. An unopened server or an account prompt is not proof of insufficient RAM.

Use the [regional troubleshooting steps](/en/guides/download/#download-failed-choose-the-stage-and-region) and include the device, OS, time and exact error in a support report.

## Requirements questions

### Is 55GB the download size?

No. It is the regional FAQ recommendation for free storage before installation. The full download amount and final installed size have not been measured by this guide.

### Is an SSD required on PC?

The FAQs recommend an SSD. This guide does not recast that recommendation as a separate hard installation requirement or promise a specific frame rate.

### Can PC and mobile share progress?

Japan's FAQ confirms same-account progress on PC, Android and iOS. China's official service confirms PC, Android, iOS and HarmonyOS, with some channel-server exceptions. This does not establish cross-region progress or shared paid currency. See [regional availability](/en/guides/global-release/).
