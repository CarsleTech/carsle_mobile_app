// import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, PermissionsAndroid } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import {
//   ClientRoleType,
//   createAgoraRtcEngine,
//   IRtcEngine,
//   RtcSurfaceView,
//   ChannelProfileType,
// } from 'react-native-agora'
// import Icon from 'react-native-vector-icons/MaterialIcons'

// const { width, height } = Dimensions.get('window')

// // Replace with your actual Agora App ID
// const appId = 'YOUR_AGORA_APP_ID'
// const token = null // Use null for testing, implement token server for production
// const channelName = 'video-consultation'

// const VideoConsultation = () => {
//   const [isJoined, setIsJoined] = useState(false)
//   const [remoteUid, setRemoteUid] = useState(0)
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true)
//   const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true)
//   const [engine, setEngine] = useState(null)

//   useEffect(() => {
//     setupVideoSDKEngine()
    
//     return () => {
//       if (engine) {
//         engine.leaveChannel()
//         engine.unregisterEventHandler()
//         engine.release()
//       }
//     }
//   }, [])

//   const setupVideoSDKEngine = async () => {
//     try {
//       await getPermission()
      
//       const agoraEngine = createAgoraRtcEngine()
//       setEngine(agoraEngine)

//       agoraEngine.registerEventHandler({
//         onJoinChannelSuccess: () => {
//           console.log('Successfully joined channel')
//           setIsJoined(true)
//         },
//         onUserJoined: (_connection, uid) => {
//           console.log('Remote user joined with uid:', uid)
//           setRemoteUid(uid)
//         },
//         onUserOffline: (_connection, uid) => {
//           console.log('Remote user left with uid:', uid)
//           setRemoteUid(0)
//         },
//       })

//       agoraEngine.initialize({
//         appId: appId,
//         channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
//       })

//       agoraEngine.enableVideo()
//       agoraEngine.enableAudio()
//     } catch (error) {
//       console.error('Error setting up Agora engine:', error)
//     }
//   }

//   const getPermission = async () => {
//     try {
//       await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//       ])
//     } catch (error) {
//       console.log('Permission request error:', error)
//     }
//   }

//   const join = async () => {
//     if (isJoined) return
    
//     try {
//       await engine?.setClientRole(ClientRoleType.ClientRoleBroadcaster)
//       await engine?.startPreview()
//       await engine?.joinChannel(token, channelName, 0, {
//         clientRoleType: ClientRoleType.ClientRoleBroadcaster,
//       })
//     } catch (error) {
//       console.error('Error joining channel:', error)
//     }
//   }

//   const leave = async () => {
//     try {
//       await engine?.leaveChannel()
//       setRemoteUid(0)
//       setIsJoined(false)
//     } catch (error) {
//       console.error('Error leaving channel:', error)
//     }
//   }

//   const toggleVideo = () => {
//     const newState = !isVideoEnabled
//     setIsVideoEnabled(newState)
//     engine?.enableLocalVideo(newState)
//   }

//   const toggleAudio = () => {
//     const newState = !isAudioEnabled
//     setIsAudioEnabled(newState)
//     engine?.enableLocalAudio(newState)
//   }

//   const toggleSpeaker = () => {
//     const newState = !isSpeakerEnabled
//     setIsSpeakerEnabled(newState)
//     engine?.setEnableSpeakerphone(newState)
//   }

//   const switchCamera = () => {
//     engine?.switchCamera()
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Video Consultation</Text>
//         <Text style={styles.headerSubtitle}>
//           {isJoined ? 'Connected' : 'Connecting...'}
//         </Text>
//       </View>

//       {/* Video Views */}
//       <View style={styles.videoContainer}>
//         {/* Remote Video (Main View) */}
//         <View style={styles.remoteVideoContainer}>
//           {remoteUid !== 0 ? (
//             <RtcSurfaceView
//               style={styles.remoteVideo}
//               canvas={{ uid: remoteUid }}
//             />
//           ) : (
//             <View style={styles.placeholderVideo}>
//               <Icon name="person" size={80} color="#666" />
//               <Text style={styles.placeholderText}>
//                 Waiting for doctor to join...
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Local Video (Small View) */}
//         <View style={styles.localVideoContainer}>
//           {isVideoEnabled ? (
//             <RtcSurfaceView
//               style={styles.localVideo}
//               canvas={{ uid: 0 }}
//             />
//           ) : (
//             <View style={styles.localVideoDisabled}>
//               <Icon name="videocam-off" size={30} color="#fff" />
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Call Controls */}
//       <View style={styles.controlsContainer}>
//         <TouchableOpacity
//           style={[styles.controlButton, !isAudioEnabled && styles.controlButtonDisabled]}
//           onPress={toggleAudio}
//         >
//           <Icon 
//             name={isAudioEnabled ? "mic" : "mic-off"} 
//             size={24} 
//             color="#fff" 
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]}
//           onPress={toggleVideo}
//         >
//           <Icon 
//             name={isVideoEnabled ? "videocam" : "videocam-off"} 
//             size={24} 
//             color="#fff" 
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.controlButton}
//           onPress={switchCamera}
//         >
//           <Icon name="flip-camera-ios" size={24} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.controlButton, !isSpeakerEnabled && styles.controlButtonDisabled]}
//           onPress={toggleSpeaker}
//         >
//           <Icon 
//             name={isSpeakerEnabled ? "volume-up" : "volume-off"} 
//             size={24} 
//             color="#fff" 
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.endCallButton}
//           onPress={leave}
//         >
//           <Icon name="call-end" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Join/Leave Button */}
//       <View style={styles.joinButtonContainer}>
//         <TouchableOpacity
//           style={[styles.joinButton, isJoined && styles.joinButtonConnected]}
//           onPress={isJoined ? leave : join}
//         >
//           <Text style={styles.joinButtonText}>
//             {isJoined ? 'Leave Call' : 'Join Call'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// export default VideoConsultation

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1a1a1a',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 4,
//   },
//   videoContainer: {
//     flex: 1,
//     position: 'relative',
//   },
//   remoteVideoContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   remoteVideo: {
//     flex: 1,
//   },
//   placeholderVideo: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#2a2a2a',
//   },
//   placeholderText: {
//     color: '#666',
//     fontSize: 16,
//     marginTop: 10,
//   },
//   localVideoContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     width: 120,
//     height: 160,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#333',
//   },
//   localVideo: {
//     flex: 1,
//   },
//   localVideoDisabled: {
//     flex: 1,
//     backgroundColor: '#333',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   controlsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   controlButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#333',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   controlButtonDisabled: {
//     backgroundColor: '#666',
//   },
//   endCallButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#ff4444',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   joinButtonContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   joinButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   joinButtonConnected: {
//     backgroundColor: '#ff4444',
//   },
//   joinButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// })
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const videoConsultultation = () => {
  return (
    <View>
      <Text>videoConsultultation</Text>
    </View>
  )
}

export default videoConsultultation

const styles = StyleSheet.create({})