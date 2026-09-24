import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { CommentSetter } from 'src/Form/components/CommentSetter';
import { useState } from 'react';
import { AppText } from 'components/AppText';

interface Props {
    onSend?: (comment: string) => void;
    commentCount?: number;
}

export const CommentSection = ({onSend, commentCount = 0 }: Props) => {
    const [comment, setComment] = useState('');

    const { colors } = useTheme();
    const { t } = useTranslation();
    
    return (
        <View className="mt-5 gap-1">
            <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 20 }}>
                    {commentCount}{' '}{t('forms.comment')}
            </AppText>

            <CommentSetter comment={comment} setComment={setComment} onSend={onSend} />
        </View>
    );
};