import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LevelData {
  level: number;
  proficiencyBonus: number;
  features: string;
}

interface Ability {
  id: string;
  name: string;
  description: string;
  level: number;
}

const Index = () => {
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityDesc, setNewAbilityDesc] = useState('');
  const [newAbilityLevel, setNewAbilityLevel] = useState<number>(1);
  const [editingAbility, setEditingAbility] = useState<Ability | null>(null);

  const levelTable: LevelData[] = Array.from({ length: 20 }, (_, i) => ({
    level: i + 1,
    proficiencyBonus: Math.floor((i + 1 - 1) / 4) + 2,
    features: abilities
      .filter(a => a.level === i + 1)
      .map(a => a.name)
      .join(', ') || '-'
  }));

  const addAbility = () => {
    if (newAbilityName && newAbilityDesc) {
      setAbilities(prev => [...prev, {
        id: Date.now().toString(),
        name: newAbilityName,
        description: newAbilityDesc,
        level: newAbilityLevel
      }]);
      setNewAbilityName('');
      setNewAbilityDesc('');
      setNewAbilityLevel(1);
    }
  };

  const startEditAbility = (ability: Ability) => {
    setEditingAbility(ability);
    setNewAbilityName(ability.name);
    setNewAbilityDesc(ability.description);
    setNewAbilityLevel(ability.level);
  };

  const saveEditAbility = () => {
    if (editingAbility && newAbilityName && newAbilityDesc) {
      setAbilities(prev => prev.map(a => 
        a.id === editingAbility.id 
          ? { ...a, name: newAbilityName, description: newAbilityDesc, level: newAbilityLevel }
          : a
      ));
      setEditingAbility(null);
      setNewAbilityName('');
      setNewAbilityDesc('');
      setNewAbilityLevel(1);
    }
  };

  const cancelEdit = () => {
    setEditingAbility(null);
    setNewAbilityName('');
    setNewAbilityDesc('');
    setNewAbilityLevel(1);
  };

  const removeAbility = (id: string) => {
    setAbilities(prev => prev.filter(a => a.id !== id));
  };

  const getAbilitiesByLevel = (level: number) => {
    return abilities.filter(a => a.level === level);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Конструктор Класса D&D</h1>
          <p className="text-muted-foreground">Создай свой уникальный класс персонажа</p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BookOpen" size={24} />
              Основная информация
            </CardTitle>
            <CardDescription>Название и описание вашего класса</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Название класса</Label>
              <Input
                id="className"
                placeholder="Воин Тени, Мастер Стихий, Лесной Страж..."
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="bg-background/50 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classDescription">Описание класса</Label>
              <Textarea
                id="classDescription"
                placeholder="Опишите концепцию класса, его роль в партии, основные механики..."
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
                className="bg-background/50 min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">
              <Icon name="Table" size={16} className="mr-2" />
              Таблица уровней
            </TabsTrigger>
            <TabsTrigger value="abilities">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Способности ({abilities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-6">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} />
                  Таблица прогрессии класса
                </CardTitle>
                <CardDescription>
                  Автоматически обновляется при добавлении способностей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-bold text-center w-32">Уровень</TableHead>
                          <TableHead className="font-bold">Особенности</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {levelTable.map((row) => {
                          const levelAbilities = getAbilitiesByLevel(row.level);
                          return (
                            <TableRow 
                              key={row.level}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell className="text-center font-semibold text-primary">
                                {row.level}
                              </TableCell>
                              <TableCell>
                                {levelAbilities.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {levelAbilities.map(ability => (
                                      <span 
                                        key={ability.id}
                                        className="text-sm bg-primary/20 text-primary px-2 py-1 rounded"
                                      >
                                        {ability.name}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abilities" className="mt-6 space-y-6">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Plus" size={24} />
                  Добавить способность
                </CardTitle>
                <CardDescription>
                  Привяжите способность к определённому уровню
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="abilityName">Название способности</Label>
                    <Input
                      id="abilityName"
                      placeholder="Второе дыхание, Огненный шар..."
                      value={newAbilityName}
                      onChange={(e) => setNewAbilityName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abilityLevel">Получение на уровне</Label>
                    <Select
                      value={newAbilityLevel.toString()}
                      onValueChange={(val) => setNewAbilityLevel(Number(val))}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Выберите уровень" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(level => (
                          <SelectItem key={level} value={level.toString()}>
                            Уровень {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abilityDesc">Описание способности</Label>
                  <Textarea
                    id="abilityDesc"
                    placeholder="Подробно опишите механику способности, урон, дальность, ограничения использования..."
                    value={newAbilityDesc}
                    onChange={(e) => setNewAbilityDesc(e.target.value)}
                    className="bg-background/50 min-h-32"
                  />
                </div>

                {editingAbility ? (
                  <div className="flex gap-2">
                    <Button onClick={saveEditAbility} className="flex-1" size="lg">
                      <Icon name="Check" size={20} className="mr-2" />
                      Сохранить изменения
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" size="lg">
                      <Icon name="X" size={20} className="mr-2" />
                      Отмена
                    </Button>
                  </div>
                ) : (
                  <Button onClick={addAbility} className="w-full" size="lg">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить способность
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="List" size={24} />
                  Список способностей
                </CardTitle>
              </CardHeader>
              <CardContent>
                {abilities.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="PackageOpen" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Пока нет способностей. Добавьте первую!</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {abilities
                      .sort((a, b) => a.level - b.level)
                      .map((ability) => (
                        <div
                          key={ability.id}
                          className="p-4 rounded-lg bg-muted/30 border border-border space-y-2 group hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary font-bold flex-shrink-0">
                                {ability.level}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg">{ability.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {ability.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditAbility(ability)}
                                className="flex-shrink-0"
                              >
                                <Icon name="Pencil" size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeAbility(ability.id)}
                                className="flex-shrink-0"
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;