import React from 'react';
import { Linking, Alert, TouchableOpacity, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import { View, Text, Icon } from 'uikit';
import { downloadFile } from 'utils/hooks/downloadFile';
import constColors from 'utils/constants/constColors';
import { ICONS } from 'utils/models/IconsType';

import AttachmentStyle from './AttachmentStyles';

const Attachment = (props: any) => {
    const { item, style } = props;
    const itemName = item.name || item.file_name || item.title;
    const itemURI = item.file_urls?.original || item.url?.original || item.link;
    const itemExtension = item.extension;
    const itemContentType = item.content_type;
    const mode = props.mode || 'view';
    const handleRemoval = props.handleRemoval;
    const isLoading = props.isLoading;
    const render = () => {
        const onPressFileMedia = async () => {
            if (mode == 'view') {
                Linking.canOpenURL(itemURI).then(res => {
                    if (res) {
                        downloadFile(itemURI, itemName);
                        if (Platform.OS === 'ios') {
                            InAppBrowser.open(item.uri, {
                                modalPresentationStyle: 'fullScreen',
                            });
                        } else {
                            Linking.openURL(item.uri);
                        }
                    } else {
                        Alert.alert(
                            `Something went wrong: couldn't download the file.`,
                        );
                    }
                });
            } else {
                handleRemoval(item);
            }
        };

        const fileIcon = () => {
            switch (true) {
                case /video\/.+/.test(itemContentType):
                    return ICONS.Video;
                case /image\/.+/.test(itemContentType):
                    return ICONS.Image;
            }

            switch (true) {
                case /pdf/.test(itemExtension):
                    return ICONS.PDF;
                case /xls|csv/.test(itemExtension):
                    return ICONS.Spreadsheet;
                case /doc/.test(itemExtension):
                    return ICONS.Doc;
                case /ppt/.test(itemExtension):
                    return ICONS.PPT;
            }

            return ICONS.MiscellaneousFile;
        };
        return (
            <View style={[AttachmentStyle.fileBadgeContainer, style]}>
                <View style={{ flexDirection: 'row' }}>
                    <Icon
                        size={14}
                        icon={fileIcon()}
                        color={constColors.textTitle}
                        style={{ marginRight: 8, width: 14, flexShrink: 0 }}
                    />
                    <Text
                        headingType={'h6'}
                        fontWeight={'normal'}
                        numberOfLines={1}
                        color={constColors.textPlaceholder}
                        wrapperStyle={{ flexGrow: 1, paddingRight: 12 }}>
                        {itemName}
                    </Text>
                </View>
                {isLoading ? (
                    <ActivityIndicator
                        color={constColors.bgStatusBar}
                        size="small"
                    />
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            onPressFileMedia();
                        }}
                        style={{ paddingLeft: 12 }}>
                        {mode == 'edit' ? (
                            <Icon
                                size={16}
                                icon={ICONS.TRASH}
                                color={constColors.textTitle}
                                style={{ padding: 4 }}
                            />
                        ) : (
                            <Icon
                                size={16}
                                icon={ICONS.DOWNLOAD}
                                color={constColors.textTitle}
                                style={{ padding: 4 }}
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return render();
};

export default Attachment;
