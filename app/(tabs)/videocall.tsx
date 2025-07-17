import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';

const { width, height } = Dimensions.get('window');
const APP_ID = '9a995d36550b4bd4b247fc391a77991a';

const VideoCallScreen = () => {
  // Default values - you can modify these or pass them as props
  const channelName = 'test-channel';
  const token = ''; // Add your token here or leave empty for testing
  const callerName = 'Caller';
  
  // State variables
  const [engine, setEngine] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Initialize Agora engine
  useEffect(() => {
    const initAgora = async () => {
      try {
        const agoraEngine = createAgoraRtcEngine();
        setEngine(agoraEngine);

        // Initialize engine
        agoraEngine.initialize({
          appId: APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });

        // Configure engine
        await agoraEngine.enableVideo();
        await agoraEngine.enableAudio();
        await agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

        // Event listeners
        agoraEngine.addListener('onJoinChannelSuccess', (connection, elapsed) => {
          console.log('onJoinChannelSuccess', connection, elapsed);
          setIsJoined(true);
          setIsConnected(true);
          startTimer();
        });

        agoraEngine.addListener('onUserJoined', (connection, remoteUid, elapsed) => {
          console.log('onUserJoined', connection, remoteUid, elapsed);
          setRemoteUsers(prev => [...prev, remoteUid]);
        });

        agoraEngine.addListener('onUserOffline', (connection, remoteUid, reason) => {
          console.log('onUserOffline', connection, remoteUid, reason);
          setRemoteUsers(prev => prev.filter(id => id !== remoteUid));
        });

        agoraEngine.addListener('onError', (err, msg) => {
          console.log('onError', err, msg);
          setShowErrorModal(`Call error: ${err} - ${msg}`);
        });

        // Join channel
        await agoraEngine.joinChannel(token, channelName, 0, {});

      } catch (error) {
        console.error('Error initializing Agora:', error);
        setShowErrorModal('Failed to initialize video call');
      }
    };

    initAgora();

    return () => {
      if (engine) {
        engine.leaveChannel();
        engine.unregisterEventHandler();
        engine.release();
      }
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  // Timer functions
  const startTimer = () => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Control handlers
  const toggleMic = useCallback(async () => {
    if (engine) {
      await engine.enableLocalAudio(!micOn);
      setMicOn(!micOn);
    }
  }, [engine, micOn]);

  const toggleCamera = useCallback(async () => {
    if (engine) {
      await engine.enableLocalVideo(!cameraOn);
      setCameraOn(!cameraOn);
    }
  }, [engine, cameraOn]);

  const endCall = useCallback(async () => {
    try {
      stopTimer();
      
      if (engine) {
        await engine.leaveChannel();
        engine.unregisterEventHandler();
        await engine.release();
      }

      const durationInMinutes = parseFloat((callDuration / 60).toFixed(2));
      const rate = 200; // Default rate
      
      const summaryLines = [
        `Call ended`,
        `Duration: ${formatDuration(callDuration)}`,
        `Amount Earned: NGN${(rate * durationInMinutes).toFixed(2)}`,
        `Carsle kept: NGN${(rate * durationInMinutes * 0.05).toFixed(2)}`,
      ];

      setShowSummaryModal(summaryLines);
      setIsConnected(false);
      setIsJoined(false);
      
    } catch (error) {
      console.error('Error ending call:', error);
      Alert.alert('Error', 'Failed to end call properly');
    }
  }, [engine, callDuration]);

  // Render remote users
  const renderRemoteUsers = () => {
    if (remoteUsers.length === 0) {
      return (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Waiting for {callerName} to join...</Text>
        </View>
      );
    }

    return remoteUsers.map((uid, index) => (
      <View key={uid} style={styles.remoteVideoContainer}>
        {/* Replace with actual Agora remote view component */}
        <View style={styles.remoteVideo}>
          <Text style={styles.remoteVideoText}>Remote User {uid}</Text>
        </View>
        <View style={styles.remoteUserLabel}>
          <Text style={styles.remoteUserName}>{callerName}</Text>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Video Container */}
      <View style={styles.videoContainer}>
        {/* Remote Video */}
        <View style={styles.remoteVideoWrapper}>
          {renderRemoteUsers()}
        </View>

        {/* Local Video */}
        <View style={styles.localVideoContainer}>
          {cameraOn ? (
            <View style={styles.localVideo}>
              <Text style={styles.localVideoText}>Local Camera</Text>
            </View>
          ) : (
            <View style={styles.localVideoOff}>
              <Text style={styles.localVideoOffText}>Camera Off</Text>
            </View>
          )}
          <View style={styles.localUserLabel}>
            <Text style={styles.localUserName}>You</Text>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatDuration(callDuration)}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, !micOn && styles.controlButtonDisabled]}
            onPress={toggleMic}
          >
            <Text style={styles.controlButtonText}>
              {micOn ? '🎤' : '🎤'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !cameraOn && styles.controlButtonDisabled]}
            onPress={toggleCamera}
          >
            <Text style={styles.controlButtonText}>
              {cameraOn ? '📹' : '📹'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={endCall}
          >
            <Text style={styles.controlButtonText}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </Text>
        </View>
      </View>

      {/* Error Modal */}
      <Modal
        visible={!!showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalText}>{showErrorModal}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowErrorModal(null)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Summary Modal */}
      <Modal
        visible={!!showSummaryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSummaryModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Call Summary</Text>
            {showSummaryModal?.map((line, index) => (
              <Text key={index} style={styles.modalText}>{line}</Text>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSummaryModal(null)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoWrapper: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  remoteVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideoText: {
    color: '#ffffff',
    fontSize: 16,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  waitingText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FCDF03',
  },
  localVideo: {
    flex: 1,
    backgroundColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoText: {
    color: '#ffffff',
    fontSize: 10,
  },
  localVideoOff: {
    flex: 1,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoOffText: {
    color: '#ffffff',
    fontSize: 12,
  },
  localUserLabel: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#FCDF03',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  localUserName: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '600',
  },
  remoteUserLabel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  remoteUserName: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  timerContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: '#666666',
  },
  endCallButton: {
    backgroundColor: '#ff4444',
  },
  controlButtonText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000000',
  },
  modalButton: {
    backgroundColor: '#FCDF03',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VideoCallScreen;