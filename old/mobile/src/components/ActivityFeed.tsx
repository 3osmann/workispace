
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ActivityItem, ActivityType } from '../types';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, title }) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'device':
        return '📱';
      case 'user':
        return '👤';
      case 'rental':
        return '📋';
      case 'return':
        return '📦';
      default:
        return '📌';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.list}>
        {activities.map((activity) => (
          <TouchableOpacity key={activity.id} style={styles.item}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{getActivityIcon(activity.type)}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.description}>{activity.description}</Text>
              <Text style={styles.time}>{activity.time}</Text>
            </View>
            {activity.user && (
              <View style={styles.userContainer}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>{activity.user.initials}</Text>
                </View>
                <Text style={styles.userName}>{activity.user.name}</Text>
              </View>
            )}
            {activity.status && (
              <View style={styles.statusContainer}>
                <View 
                  style={[
                    styles.statusDot, 
                    activity.status === 'completed' && styles.statusCompleted,
                    activity.status === 'pending' && styles.statusPending,
                    activity.status === 'inProgress' && styles.statusInProgress,
                  ]} 
                />
                <Text style={styles.statusText}>
                  {activity.status === 'completed' ? 'Terminé' : 
                   activity.status === 'pending' ? 'En attente' : 
                   activity.status === 'inProgress' ? 'En cours' : 
                   activity.status}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  userContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  userInitials: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userName: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    backgroundColor: '#999',
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FFC107',
  },
  statusInProgress: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
});

export default ActivityFeed;
