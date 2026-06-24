import { useRef } from "react";
import { useTheme } from "context/ThemeContext"
import { TextInput, Text, View, Platform } from "react-native"
import {AppText} from 'components/AppText';
import {AppTextInput} from 'components/AppTextInput';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

interface Props {
    review: any;
    setReview: any;
}

export const ReviewSetter = ({review, setReview} : Props) => {
    const { colors } = useTheme();

    const richText = useRef<RichEditor>(null);

    // esto para no contar los tipos de letras (negrita y tal) como caracteres
    const plainTextLength = (review || '')
        .replace(/<[^>]*>?/gm, '') // Quita todas las etiquetas HTML
        .replace(/&nbsp;/g, ' ')   // Convierte los espacios HTML en espacios reales
        .length;

    return (
        <View 
            className="relative flex-1 rounded-xl overflow-hidden" 
            style={{ 
                backgroundColor: colors.surfaceButton, 
                minHeight: Platform.OS === 'web' ? 120 : 180 // En web no necesitamos tanto alto porque no hay barra
            }}
        >
            {Platform.OS === 'web' ? (
                // NAVEGADOR 
                <AppTextInput 
                    value={review}
                    onChangeText={setReview}
                    placeholder="[Modo Web] Escribe tu opinión plana..."
                    placeholderTextColor={colors.placeholderText}
                    multiline
                    numberOfLines={3}
                    maxLength={1000}
                    className="flex-1 p-3 text-base"
                    style={{color: colors.primaryText}}
                    textAlignVertical="top"
                />
            ) : (
                //IOS / ANDROID
                <>
                    <RichToolbar
                        editor={richText}
                        actions={[
                            actions.setBold, 
                            actions.setItalic, 
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                        ]}
                        iconTint={colors.primaryText}
                        selectedIconTint={colors.primary}
                        style={{ 
                            backgroundColor: colors.surfaceButton, 
                            borderBottomWidth: 1, 
                            borderBottomColor: colors.background 
                        }}
                    />
                    <RichEditor
                        ref={richText}
                        initialContentHTML={review}
                        onChange={setReview}
                        placeholder="Escribe tu opinión..."
                        editorStyle={{
                            backgroundColor: colors.surfaceButton,
                            color: colors.primaryText,
                            placeholderColor: colors.placeholderText,
                        }}
                        style={{ flex: 1, marginBottom: 24 }} 
                    />
                </>
            )}

            {/* El contador de caracteres es igual para ambos */}
            <AppText 
                className="absolute bottom-0 right-0 text-right text-xs m-2" 
                style={{ color: plainTextLength > 1000 ? 'red' : colors.placeholderText }}
            >
                {plainTextLength}/1000
            </AppText>
        </View>
    );
}