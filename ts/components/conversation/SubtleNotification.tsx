import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useIsIncomingRequest, useIsOutgoingRequest } from '../../hooks/useParamSelector';
import {
  getSelectedHasMessages,
  hasSelectedConversationIncomingMessages,
} from '../../state/selectors/conversations';
import {
  getSelectedCanWrite,
  useSelectedConversationKey,
  useSelectedHasDisabledBlindedMsgRequests,
  useSelectedIsNoteToSelf,
  useSelectedNicknameOrProfileNameOrShortenedPubkey,
} from '../../state/selectors/selectedConversation';
import { LocalizerKeys } from '../../types/LocalizerKeys';
import { SessionHtmlRenderer } from '../basic/SessionHTMLRenderer';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: var(--margins-lg);
  background-color: var(--background-secondary-color);
`;

const TextInner = styled.div`
  color: var(--text-secondary-color);
  text-align: center;
  max-width: 390px;
`;

/**
 * This component is used to display a warning when the user is sending a message request.
 *
 */
export const ConversationOutgoingRequestExplanation = () => {
  const selectedConversation = useSelectedConversationKey();
  const isOutgoingMessageRequest = useIsOutgoingRequest(selectedConversation);
  const hasIncomingMessages = useSelector(hasSelectedConversationIncomingMessages);

  const showMsgRequestUI = selectedConversation && isOutgoingMessageRequest;

  if (!showMsgRequestUI || hasIncomingMessages) {
    return null;
  }

  return (
    <Container data-testid={'empty-conversation-control-message'} style={{ padding: 0 }}>
      <TextInner>{window.i18n('messageRequestPendingDescription')}</TextInner>
    </Container>
  );
};

/**
 * This component is used to display a warning when the user is responding to a message request.
 *
 */
export const ConversationIncomingRequestExplanation = () => {
  const selectedConversation = useSelectedConversationKey();
  const isIncomingMessageRequest = useIsIncomingRequest(selectedConversation);

  const showMsgRequestUI = selectedConversation && isIncomingMessageRequest;
  const hasIncomingMessages = useSelector(hasSelectedConversationIncomingMessages);

  if (!showMsgRequestUI || !hasIncomingMessages) {
    return null;
  }

  return (
    <Container>
      <TextInner>{window.i18n('messageRequestsAcceptDescription')}</TextInner>
    </Container>
  );
};

/**
 * This component is used to display a warning when the user is looking at an empty conversation.
 */
export const NoMessageInConversation = () => {
  const selectedConversation = useSelectedConversationKey();

  const hasMessage = useSelector(getSelectedHasMessages);

  const isMe = useSelectedIsNoteToSelf();
  const canWrite = useSelector(getSelectedCanWrite);
  const privateBlindedAndBlockingMsgReqs = useSelectedHasDisabledBlindedMsgRequests();
  // TODOLATER use this selector across the whole application (left pane excluded)
  const nameToRender = useSelectedNicknameOrProfileNameOrShortenedPubkey();

  if (!selectedConversation || hasMessage) {
    return null;
  }
  let localizedKey: LocalizerKeys = 'noMessagesInEverythingElse';
  if (!canWrite) {
    if (privateBlindedAndBlockingMsgReqs) {
      localizedKey = 'noMessagesInBlindedDisabledMsgRequests';
    } else {
      localizedKey = 'noMessagesInReadOnly';
    }
  } else if (isMe) {
    localizedKey = 'noMessagesInNoteToSelf';
  }

  return (
    <Container data-testid="empty-conversation-notification">
      <TextInner>
        <SessionHtmlRenderer html={window.i18n(localizedKey, [nameToRender])} />
      </TextInner>
    </Container>
  );
};
