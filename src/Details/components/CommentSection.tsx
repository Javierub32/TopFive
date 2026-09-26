import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { CommentSetter } from 'src/Form/components/CommentSetter';
import { RefObject, useState } from 'react';
import { AppText } from 'components/AppText';
import { useComments } from '../hooks/useComments';
import { CommentItem } from './CommentItem';
import { SeparatorLine } from 'components/SeparatorLine';

interface Props {
    resourceId?: number;
    resourceType?: string;
    focusComment?: boolean;
    scrollRef?: RefObject<ScrollView | null>;
}

export const CommentSection = ({ resourceId, resourceType, focusComment = false, scrollRef }: Props) => {
    const [comment, setComment] = useState('');

    const { colors } = useTheme();
    const { t } = useTranslation();
    const {
        comments,
        commentCount,
        loading,
        loadingMore,
        hasMore,
        isError,
        handleLoadMore,
        sendComment,
        sending,
    } = useComments(resourceId, resourceType);

    return (
        <View className="mt-8 gap-1">
            <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 20 }}>
                    {commentCount}{' '}{t('login.forms.comment')}
            </AppText>
                <CommentSetter
                    comment={comment}
                    setComment={setComment}
                    onSend={sendComment}
                    sending={sending}
                    autoFocus={focusComment}
                    scrollRef={scrollRef}
                />
            
                <SeparatorLine className="my-3" />
            
            <View className="mt-2 gap-2">
                {/* ActivityIndicator = Carga de comentarios, el circulito */}
                {loading ? (
                    <ActivityIndicator color={colors.primary} className="py-4" />
                ) : isError ? (
                    <AppText className="py-4 text-center" style={{ color: colors.error, fontSize: 14 }}>
                        {t('login.forms.commentsLoadingError')}
                    </AppText>
                ) : comments.length === 0 ? (
                    <AppText className="py-4 text-center" style={{ color: colors.secondaryText, fontSize: 14 }}>
                        {t('login.forms.noComments')}
                    </AppText>
                ) : (
                    comments.map((item) => <CommentItem key={item.id} comment={item} />)
                )}

                {hasMore && (
                    <TouchableOpacity
                        onPress={handleLoadMore}
                        disabled={loadingMore}
                        activeOpacity={0.7}
                        className="items-center py-3">
                        {loadingMore ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : (
                            <AppText className="font-semibold" style={{ color: colors.primary, fontSize: 14 }}>
                                {t('login.forms.loadMoreComments')}
                            </AppText>
                        )}
                    </TouchableOpacity>
                )}

                <View className="h-32" />
            </View>
        </View>
    );
};
