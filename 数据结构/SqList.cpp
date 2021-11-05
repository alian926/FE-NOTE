#include <stdio.h>
#include <iostream>
using namespace std;
#define MaxSize 10

// 简单的静态数组
typedef struct
{
  int data[MaxSize];
  int length;
} SqList;

void InitList(SqList &L)
{
  for (int i = 0; i < MaxSize; i++)
  {
    L.data[i] = 0;
  }
  L.length = 0;
}
// 位序i 从1开始计数
bool ListInsert(SqList &L, int i, int e)
{
  if (i < 1 || i > L.length + 1)
    return false;
  if (L.length >= MaxSize)
    return false;
  for (int j = L.length; j >= i; j--)
    L.data[j] = L.data[j - 1];

  L.data[i - 1] = e;
  L.length++;
  return true;
}

bool ListDelete(SqList &L, int i, int &e)
{
  if (i < 1 || i > L.length)
    return false;
  e = L.data[i - 1];
  for (int j = i; j < L.length; j++)
    L.data[j - 1] = L.data[j];
  L.data[L.length - 1] = 0;
  L.length--;
  return true;
}

void PrintList(SqList L)
{
  for (int i = 0; i < MaxSize; i++)
  {
    printf("data[%d]=%d\n", i, L.data[i]);
  }
  printf("\n");
}

int main()
{
  SqList L;
  InitList(L);
  ListInsert(L, 1, 1);
  ListInsert(L, 2, 2);
  ListInsert(L, 3, 3);
  ListInsert(L, 4, 4);
  ListInsert(L, 5, 5);
  ListInsert(L, 2, 5);
  int e = -1;
  if (ListDelete(L, 2, e))
  {
    printf("已经删除第2个元素,删除元素值为%d\n", e);
  }
  else
  {
    cout << "位序i不合法,删除失败\n" << endl;
  }
  PrintList(L);
  return 0;
}