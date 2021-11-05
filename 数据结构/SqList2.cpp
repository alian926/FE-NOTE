#include <stdio.h>
#include <stdlib.h>
#define InitSize 10
// 动态数组
typedef struct
{
  int *data;
  int MaxSize;
  int length;
} SeqList;

void InitList(SeqList &L)
{
  // L.data = new int(InitSize * sizeof(int));
  // malloc 需要引入头文件 <stdlib.h>
  L.data = (int *)malloc(InitSize * sizeof(int));
  L.length = 0;
  L.MaxSize = InitSize;
}

void IncreaseSize(SeqList &L, int len)
{
  int *p = L.data;
  // L.data = new int((L.MaxSize + len) * sizeof(int));
  L.data = (int *)malloc((L.MaxSize + len) * sizeof(int));
  for (int i = 0; i < L.length; i++)
  {
    L.data[i] = p[i];
  }
  L.MaxSize = L.MaxSize + len;
  free(p);
}

int main()
{
  SeqList L;
  InitList(L);
  IncreaseSize(L, 5);
  return 0;
}